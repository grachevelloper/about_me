//TODO: make it alive
import {
    KitchenSinkToolbar,
    MDXEditor,
    MDXEditorMethods,
    MDXEditorProps,
    headingsPlugin,
    linkDialogPlugin,
    linkPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import {ForwardedRef} from 'react';

interface InitializedMDXEditorProps extends MDXEditorProps {
    editorRef?: ForwardedRef<MDXEditorMethods>;
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
                linkPlugin(),
                linkDialogPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({toolbarContents: () => <KitchenSinkToolbar />}),
            ]}
            {...props}
            markdown={markdown || ''}
        />
    );
}
