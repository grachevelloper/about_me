import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    ChangeAdmonitionType,
    ConditionalContents,
    CreateLink,
    DirectiveNode,
    EditorInFocus,
    HighlightToggle,
    InsertCodeBlock,
    InsertImage,
    InsertThematicBreak,
    ListsToggle,
    MDXEditor,
    MDXEditorMethods,
    MDXEditorProps,
    StrikeThroughSupSubToggles,
    UndoRedo,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import {Flex} from 'antd';
import block from 'bem-cn-lite';
import {ForwardedRef} from 'react';
import './MdEditor.scss';

const b = block('md-editor');

interface InitializedMDXEditorProps extends MDXEditorProps {
    editorRef?: ForwardedRef<MDXEditorMethods>;
    editable?: boolean;
}

export function MdEditor({
    editorRef,
    markdown,
    editable,
    ...props
}: InitializedMDXEditorProps) {
    const plugins = [
        headingsPlugin({allowedHeadingLevels: [1, 2, 3]}),
        linkPlugin(),
        imagePlugin({
            imageAutocompleteSuggestions: [
                'https://via.placeholder.com/150',
                'https://via.placeholder.com/150',
            ],
            imageUploadHandler: async () =>
                Promise.resolve('https://picsum.photos/200/300'),
        }),
        listsPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
    ];
    if (editable) {
        plugins.push(
            toolbarPlugin({
                toolbarContents: () => (
                    <Flex gap={2} className={b('toolbar')}>
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <StrikeThroughSupSubToggles />
                        <HighlightToggle />
                        <ListsToggle />
                        <ConditionalContents
                            options={[
                                {
                                    when: whenInAdmonition,
                                    contents: () => <ChangeAdmonitionType />,
                                },
                                {fallback: () => <BlockTypeSelect />},
                            ]}
                        />
                        <CreateLink />
                        <InsertImage />
                        <InsertCodeBlock />
                        <InsertThematicBreak />
                    </Flex>
                ),
            })
        );
    }
    return (
        <MDXEditor
            ref={editorRef}
            plugins={plugins}
            {...props}
            markdown={markdown || ''}
        />
    );
}

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
    const node = editorInFocus?.rootNode;
    if (!node || node.getType() !== 'directive') {
        return false;
    }

    return ['note', 'tip', 'danger', 'info', 'caution'].includes(
        (node as DirectiveNode).getMdastNode().name
    );
}
