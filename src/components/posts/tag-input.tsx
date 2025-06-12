'use client';

import type * as React from 'react';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Tag, Loader2 } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestedTags: string[];
  onAddSuggestedTag: (tag: string) => void;
  isLoadingSuggestions?: boolean;
}

export function TagInput({
  value: tags,
  onChange,
  suggestedTags,
  onAddSuggestedTag,
  isLoadingSuggestions = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const addSuggestedTag = useCallback((tag: string) => {
    if (!tags.includes(tag)) {
      onAddSuggestedTag(tag); // This will trigger onChange in parent
    }
  }, [tags, onAddSuggestedTag]);

  return (
    <div className="space-y-3">
      <div>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a tag and press Enter..."
          className="w-full"
        />
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
          Suggested Tags
          {isLoadingSuggestions && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
        </h4>
        {suggestedTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map(tag => (
              <Badge
                key={tag}
                variant="outline"
                onClick={() => addSuggestedTag(tag)}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') addSuggestedTag(tag);}}
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          !isLoadingSuggestions && <p className="text-sm text-muted-foreground">No suggestions yet. Start typing your post content.</p>
        )}
      </div>
    </div>
  );
}
