'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Volume2 } from 'lucide-react';
import { textToSpeech } from '@/ai/flows/text-to-speech';

interface PostAudioPlayerProps {
  postContent: string;
}

export function PostAudioPlayer({ postContent }: PostAudioPlayerProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const handleGenerateAudio = async () => {
    setIsGenerating(true);
    setAudioSrc(null);
    try {
      // Limit content length for TTS to avoid long processing times and high costs
      const contentToSpeak = postContent.substring(0, 1000); 
      const result = await textToSpeech(contentToSpeak);
      setAudioSrc(result.media);
    } catch (error) {
      console.error('Failed to generate audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate audio for the post.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (audioSrc) {
    return (
      <div className="w-full">
        <audio controls autoPlay className="w-full h-10">
          <source src={audioSrc} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleGenerateAudio}
      disabled={isGenerating}
      className="w-full"
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Volume2 className="mr-2 h-5 w-5" />
      )}
      {isGenerating ? 'Generating Audio...' : 'Listen to Post'}
    </Button>
  );
}
