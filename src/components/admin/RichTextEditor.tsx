'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Minus,
  Undo,
  Redo,
  Lightbulb,
  Gift,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { uploadImage } from '@/lib/storage-service';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2.5 rounded-lg transition-colors ${
        isActive
          ? 'bg-[#C89A63] text-black'
          : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-8 bg-neutral-700 mx-2" />;
}

function Toolbar({ editor }: { editor: Editor }) {
  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const url = await uploadImage(file, 'blog/content');
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertTipBox = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertContent(
        '<div class="tip-box"><p><strong>💡 TIPP:</strong> Ide írd a tipped szövegét.</p></div><p></p>'
      )
      .run();
  }, [editor]);

  const insertPromoBox = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertContent(
        '<div class="promo-box"><p><strong>Próbálja ki prémium termékeinket</strong></p><p>Leírás ide...</p></div><p></p>'
      )
      .run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-neutral-700 bg-neutral-900/80">
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Visszavonás"
      >
        <Undo className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Újra"
      >
        <Redo className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text Style */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Félkövér"
      >
        <Bold className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Dőlt"
      >
        <Italic className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Aláhúzott"
      >
        <UnderlineIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Áthúzott"
      >
        <Strikethrough className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Címsor 1"
      >
        <Heading1 className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Címsor 2"
      >
        <Heading2 className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Címsor 3"
      >
        <Heading3 className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Felsorolás"
      >
        <List className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Számozott lista"
      >
        <ListOrdered className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Balra igazítás"
      >
        <AlignLeft className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Középre igazítás"
      >
        <AlignCenter className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Jobbra igazítás"
      >
        <AlignRight className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Block elements */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Idézet"
      >
        <Quote className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Elválasztó vonal"
      >
        <Minus className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Link & Image */}
      <ToolbarButton
        onClick={addLink}
        isActive={editor.isActive('link')}
        title="Hivatkozás"
      >
        <LinkIcon className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} title="Kép beszúrása">
        <ImageIcon className="h-5 w-5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Special boxes */}
      <ToolbarButton onClick={insertTipBox} title="Tipp doboz beszúrása">
        <Lightbulb className="h-5 w-5" />
      </ToolbarButton>
      <ToolbarButton onClick={insertPromoBox} title="Promó doboz beszúrása">
        <Gift className="h-5 w-5" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#1B5E4B] underline',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Kezdj el írni...',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[400px] px-4 py-3 ' +
          'prose-headings:text-neutral-100 prose-p:text-neutral-300 prose-strong:text-neutral-100 ' +
          'prose-a:text-[#C89A63] prose-blockquote:border-l-[#C89A63] prose-blockquote:text-neutral-400 ' +
          'prose-li:text-neutral-300 prose-img:rounded-xl prose-hr:border-neutral-700 ' +
          '[&_.tip-box]:bg-[#FEF3C7]/10 [&_.tip-box]:border-l-4 [&_.tip-box]:border-[#C89A63] [&_.tip-box]:p-4 [&_.tip-box]:rounded-r-lg [&_.tip-box]:my-4 ' +
          '[&_.promo-box]:bg-[#C89A63]/10 [&_.promo-box]:p-4 [&_.promo-box]:rounded-lg [&_.promo-box]:my-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value prop changes from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-neutral-700 bg-neutral-800 animate-pulse h-[460px]" />
    );
  }

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800 overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
