import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { AI_CONFIG } from './ai-config';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponseOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export async function generateAIResponse(
  prompt: string,
  systemPrompt?: string,
  options: AIResponseOptions = {}
) {
  try {
    const messages: AIMessage[] = [
      { 
        role: 'system', 
        content: systemPrompt || AI_CONFIG.roles.ASSISTANT 
      },
      { role: 'user', content: prompt }
    ];

    const response = await streamText({
      model: openai(options.model || AI_CONFIG.models.GPT4),
      messages,
      temperature: options.temperature ?? AI_CONFIG.temperature.ANALYTICAL,
      maxTokens: options.maxTokens,
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error('AI Response Generation Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

interface JobDescriptionParams {
  jobTitle: string;
  companyName: string;
  keySkills: string[];
  benefits: string[];
  employmentType: string;
  location: string;
  experience?: string;
}

export async function generateJobDescription(params: JobDescriptionParams) {
  const prompt = `
    Create a professional job description with the following structure:
    
    Position: ${params.jobTitle}
    Company: ${params.companyName}
    Location: ${params.location}
    Employment Type: ${params.employmentType}
    
    Required Skills:
    ${params.keySkills.join('\n')}
    
    Benefits:
    ${params.benefits.join('\n')}
    ${params.experience ? `\nRequired Experience: ${params.experience}` : ''}
    
    Please format the response in JSON with the following structure:
    {
      "title": "",
      "summary": "",
      "responsibilities": [],
      "requirements": [],
      "benefits": [],
      "culture": ""
    }
  `;

  return generateAIResponse(
    prompt,
    AI_CONFIG.roles.JOB_DESCRIPTION,
    { temperature: AI_CONFIG.temperature.CREATIVE }
  );
}

interface ResumeAnalysisResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  keywordDensity: Record<string, number>;
  formatIssues: string[];
}

export async function analyzeResume(
  jobDescription: string,
  resume: string
): Promise<ResumeAnalysisResult> {
  const prompt = `
    Analyze this resume against the job description and provide structured feedback:
    
    Job Description:
    ${jobDescription}
    
    Resume:
    ${resume}
    
    Provide analysis in the following JSON format:
    {
      "matchScore": number (0-100),
      "matchingSkills": string[],
      "missingSkills": string[],
      "recommendations": string[],
      "keywordDensity": object,
      "formatIssues": string[]
    }
  `;

  const response = await generateAIResponse(
    prompt,
    AI_CONFIG.roles.RESUME_ANALYZER,
    { temperature: AI_CONFIG.temperature.ANALYTICAL }
  );
  
  return JSON.parse(await response.text());
}
