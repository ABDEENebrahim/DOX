import { env } from '../config/env.js';

export async function transcribeAudio({ audioBase64, mimeType = 'audio/webm' }) {
  const form = new FormData();
  const buffer = Buffer.from(audioBase64, 'base64');
  const blob = new Blob([buffer], { type: mimeType });

  form.append('file', blob, `audio.${mimeType.split('/')[1] || 'webm'}`);
  form.append('model', env.OPENAI_WHISPER_MODEL);

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: form
  });

  if (!response.ok) {
    throw new Error(`Whisper transcription failed: ${await response.text()}`);
  }

  return response.json();
}

export async function generateDoctorResponse({ transcript, context = '' }) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: 'system',
          content:
            'You are a clinical voice assistant for doctors. Provide concise, safe, non-diagnostic workflow support.'
        },
        {
          role: 'user',
          content: `Context: ${context}\nDoctor transcript: ${transcript}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`GPT response failed: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.output_text || '';
  return { text, raw: data };
}

export async function synthesizeSpeech({ text }) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${env.ELEVENLABS_VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg'
    },
    body: JSON.stringify({
      model_id: 'eleven_multilingual_v2',
      text,
      output_format: 'mp3_44100_128'
    })
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed: ${await response.text()}`);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  return { audioBase64: audioBuffer.toString('base64') };
}

export async function doctorVoiceAssistantPipeline(input) {
  const transcription = await transcribeAudio(input);
  const aiResponse = await generateDoctorResponse({
    transcript: transcription.text || '',
    context: input.context || ''
  });
  const speech = await synthesizeSpeech({ text: aiResponse.text });

  return {
    transcript: transcription.text,
    responseText: aiResponse.text,
    responseAudioBase64: speech.audioBase64
  };
}
