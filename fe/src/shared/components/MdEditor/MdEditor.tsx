/* eslint-disable @typescript-eslint/no-unsafe-call */
//TODO: make it alive
import {
    MDXEditor,
    MDXEditorMethods,
    headingsPlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    thematicBreakPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import {ForwardedRef} from 'react';

interface InitializedMDXEditorProps {
    editorRef?: ForwardedRef<MDXEditorMethods>;
    markdown?: string;
    onChange?: (markdown: string) => void;
}

export function MdEditor({
    editorRef,
    markdown,
    ...props
}: InitializedMDXEditorProps) {
    return (
        <MDXEditor
            ref={editorRef}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
            ]}
            {...props}
            markdown={markdown || ''}
        />
    );
}
