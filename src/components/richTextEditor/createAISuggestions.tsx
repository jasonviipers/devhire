'use client';

import { Editor, Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { generateAIResponse } from '@/lib/ai/ai';
import tippy, { Instance as TippyInstance } from 'tippy.js';

interface SuggestionItem {
    title: string;
    description: string;
    command: (editor: Editor) => void;
}

// Create a custom slash command extension
const SlashCommands = Extension.create({
    name: 'slashCommands',
    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: { editor: Editor; range: any; props: any }) => {
                    props.command(editor);
                    editor.chain().focus().deleteRange(range).run();
                },
            },
        };
    },
    addProseMirror() {
        return [Suggestion({
            editor: this.editor,
            ...this.options.suggestion,
        })];
    },
});

function createAISuggestions(editor: Editor) {
    let tippyInstance: TippyInstance | null = null;
    let currentSuggestions: SuggestionItem[] = [];
    let selectedIndex = 0;

    const loadSuggestions = async (query: string) => {
        if (query.length < 2) return [];

        try {
            const response = await generateAIResponse(
                `Generate suggestions for: ${query}`,
                'You are a helpful writing assistant. Provide brief, relevant suggestions.',
                { temperature: 0.7 }
            );

            const aiSuggestions = await response.text();
            const parsedSuggestions = JSON.parse(aiSuggestions);

            return parsedSuggestions.map((suggestion: any) => ({
                title: suggestion.title,
                description: suggestion.description,
                command: (editor: Editor) => {
                    editor.chain().focus().insertContent(suggestion.content).run();
                },
            }));
        } catch (error) {
            console.error('Error loading AI suggestions:', error);
            return [];
        }
    };

    const renderSuggestionList = (items: SuggestionItem[]) => {
        const container = document.createElement('div');
        container.className = 'suggestions-popup';

        items.forEach((item, index) => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = `suggestion-item ${index === selectedIndex ? 'selected' : ''}`;
            
            const title = document.createElement('div');
            title.className = 'suggestion-title';
            title.textContent = item.title;
            
            const description = document.createElement('div');
            description.className = 'suggestion-description';
            description.textContent = item.description;
            
            suggestionElement.appendChild(title);
            suggestionElement.appendChild(description);
            
            suggestionElement.addEventListener('click', () => {
                item.command(editor);
                tippyInstance?.destroy();
            });
            
            container.appendChild(suggestionElement);
        });

        return container;
    };

    return {
        suggestion: {
            onStart: ({ editor, clientRect }: { editor: Editor; clientRect: DOMRect }) => {
                const popup = document.createElement('div');
                popup.className = 'suggestions-popup';
                document.body.appendChild(popup);

                tippyInstance = tippy(popup, {
                    getReferenceClientRect: () => clientRect,
                    appendTo: () => document.body,
                    content: popup,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                });
            },
            onUpdate: async ({ query }: { query: string }) => {
                currentSuggestions = await loadSuggestions(query);
                selectedIndex = 0;
                
                if (tippyInstance) {
                    tippyInstance.setContent(renderSuggestionList(currentSuggestions));
                }
            },
            onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                if (!currentSuggestions.length) return false;

                // Handle keyboard navigation
                switch (event.key) {
                    case 'ArrowUp':
                        selectedIndex = (selectedIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
                        event.preventDefault();
                        break;
                    case 'ArrowDown':
                        selectedIndex = (selectedIndex + 1) % currentSuggestions.length;
                        event.preventDefault();
                        break;
                    case 'Enter':
                        event.preventDefault();
                        if (currentSuggestions[selectedIndex]) {
                            currentSuggestions[selectedIndex].command(editor);
                            tippyInstance?.destroy();
                        }
                        return true;
                    case 'Escape':
                        tippyInstance?.destroy();
                        return true;
                    default:
                        return false;
                }

                // Update the UI to reflect the new selection
                if (tippyInstance) {
                    tippyInstance.setContent(renderSuggestionList(currentSuggestions));
                }

                return true;
            },
            onExit: () => {
                selectedIndex = 0;
                currentSuggestions = [];
                tippyInstance?.destroy();
                tippyInstance = null;
            },
        },
    };
}

export { SlashCommands, createAISuggestions };