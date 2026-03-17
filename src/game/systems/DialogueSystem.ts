import type { DialogueNode } from '../data/dialogues';

export class DialogueSystem {
  private active = false;
  private dialogue?: DialogueNode;
  private index = 0;

  start(dialogue: DialogueNode): void {
    this.dialogue = dialogue;
    this.index = 0;
    this.active = true;
  }

  advance(): { done: boolean; line?: string } {
    if (!this.dialogue) return { done: true };
    this.index++;
    if (this.index >= this.dialogue.lines.length) {
      this.stop();
      return { done: true };
    }
    return { done: false, line: this.dialogue.lines[this.index] };
  }

  getCurrent(): { name: string; line: string } | undefined {
    if (!this.active || !this.dialogue) return;
    return { name: this.dialogue.name, line: this.dialogue.lines[this.index] };
  }

  isActive(): boolean {
    return this.active;
  }

  stop(): void {
    this.active = false;
    this.dialogue = undefined;
    this.index = 0;
  }
}
