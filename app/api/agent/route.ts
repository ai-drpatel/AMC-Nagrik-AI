import { NextResponse } from 'next/server';
import {
  resolveWardByCoordinates,
  resolveWardByName,
  AMC_DEPARTMENTS_CONFIG,
  AMC_ALL_WARDS,
} from '../../../lib/amcDirectory';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Safely parse JSON from model output, stripping markdown code fences or conversational wrappers.
 */
function extractAndParseJSON<T>(rawText: string): T {
  let cleaned = rawText.trim();

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '');
    cleaned = cleaned.replace(/\n?```\s*$/, '');
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1)) as T;
    }
    throw new Error(`Unable to parse JSON from output: "${rawText.slice(0, 100)}..."`);
  }
}

/**
 * Convert base64 data URL to raw data and mimeType
 */
function normalizeBase64(input: string): { mimeType: string; data: string } {
  if (input.startsWith('data:')) {
    const match = input.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match && match.length === 3) {
      return { mimeType: match[1], data: match[2] };
    }
  }
  return {
    mimeType: 'image/jpeg',
    data: input.replace(/^data:[^;]+;base64,/, ''),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, locationCoords, areaHint } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Missing required field: "imageBase64"' },
        { status: 400 }
      );
    }

    // Resolve Ward by GPS coordinates if present, or areaHint
    let wardInfo = AMC_ALL_WARDS.Navrangpura;
    if (locationCoords && locationCoords.lat && locationCoords.lng) {
      wardInfo = resolveWardByCoordinates(locationCoords.lat, locationCoords.lng);
    } else if (areaHint) {
      wardInfo = resolveWardByName(areaHint);
    }

    // Google Gemini API Key from environment or request header
    const apiKey =
      req.headers.get('x-gemini-api-key') ||
      process.env.GEMINI_API_KEY;

    let extraction = {
      category: 'Pothole',
      severity: 'High' as 'Critical' | 'High' | 'Moderate',
      department: 'Roads & Bridges Department',
      summary: 'Hazardous asphalt pothole on road needing immediate resurfacing',
      estimatedSla: '24 Hours',
    };
    let aiSource: 'gemini-2.5-flash' | 'fallback' = 'gemini-2.5-flash';

    if (apiKey) {
      try {
        const { mimeType, data: cleanBase64 } = normalizeBase64(imageBase64);

        const systemPrompt = `You are the autonomous Senior Civic Inspector for Ahmedabad Municipal Corporation (AMC - અમદાવાદ મ્યુનિસિપલ કોર્પોરેશન).
Analyze the citizen's photograph of a civic defect in Ahmedabad.
Identify:
1. "category": Must be one of ["Pothole", "Garbage", "Streetlight", "Waterlogging", "Other"].
2. "severity": Must be one of ["Critical", "High", "Moderate"].
3. "department": Assign strictly to one of:
   - "Roads & Bridges Department" (potholes, asphalt damage, road caving, dividers)
   - "Solid Waste Management (SWM)" (garbage heaps, refuse, overflow bins)
   - "Street Lighting & Electrical Dept" (broken poles, dark zones, dangling wires)
   - "Drainage & Storm Water Dept" (waterlogging, backflow, open manholes)
4. "summary": A concise 5 to 8 word plain Gujarati/English layman summary (e.g. "Severe road pothole causing two-wheeler skid risk").
5. "estimatedSla": "12 Hours", "24 Hours", or "48 Hours".

Return ONLY raw JSON conforming to:
{
  "category": "Pothole | Garbage | Streetlight | Waterlogging | Other",
  "severity": "Critical | High | Moderate",
  "department": "One of the 4 AMC department names",
  "summary": "5 to 8 word plain layman summary",
  "estimatedSla": "12 Hours | 24 Hours | 48 Hours"
}`;

        const userPrompt = `A citizen captured this civic issue in ${wardInfo.name}, ${wardInfo.zone}, Ahmedabad. Inspect the photo and output the structured JSON assessment.`;

        const geminiPayload = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: cleanBase64,
                  },
                },
                { text: userPrompt },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiPayload),
        });

        if (response.ok) {
          const data = await response.json();
          const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textOutput) {
            const parsed = extractAndParseJSON<{
              category: string;
              severity: 'Critical' | 'High' | 'Moderate';
              department: string;
              summary: string;
              estimatedSla: string;
            }>(textOutput);

            extraction = {
              category: parsed.category || 'Pothole',
              severity: parsed.severity || 'High',
              department: parsed.department || 'Roads & Bridges Department',
              summary: parsed.summary || 'Civic infrastructure defect flagged for repair',
              estimatedSla: parsed.estimatedSla || '24 Hours',
            };
          }
        } else {
          console.warn('[Gemini 2.5 Flash] Request returned', response.status, 'using fallback');
          aiSource = 'fallback';
        }
      } catch (visionErr) {
        console.error('[Gemini Vision processing error]', visionErr);
        aiSource = 'fallback';
      }
    } else {
      aiSource = 'fallback';
    }

    return NextResponse.json({
      success: true,
      aiSource,
      extraction: {
        ...extraction,
        ward: wardInfo.name,
        zone: wardInfo.zone,
        headquarters: wardInfo.headquarters,
        officerName: wardInfo.officerName,
        officerPhone: wardInfo.officerPhone,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server Error';
    console.error('[Agent API Error]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
