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
import {ForwardedRef, useEffect, useRef} from 'react';

import './MdEditor.scss';
import {imageUploadHandler} from './utils';

const b = block('md-editor');

export type EntityAttachmentType = 'article' | 'todo';

interface InitializedMDXEditorProps extends MDXEditorProps {
    editorRef?: ForwardedRef<MDXEditorMethods>;
    editable?: boolean;
    entityType: EntityAttachmentType;
    entityId: string;
}

export function MdEditor({
    editorRef,
    markdown: externalMarkdown,
    editable,
    entityType,
    onChange,
    entityId,
    ...props
}: InitializedMDXEditorProps) {
    // Используем ref для хранения предыдущего значения
    const prevExternalMarkdownRef = useRef(externalMarkdown);
    const editorInstanceRef = useRef<MDXEditorMethods>(null);

    const plugins = [
        headingsPlugin({allowedHeadingLevels: [1, 2, 3]}),
        linkPlugin(),
        imagePlugin({
            imageUploadHandler: imageUploadHandler(entityType, entityId),
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

    // Обновляем редактор только когда внешний markdown изменился НЕ из-за нашего onChange
    useEffect(() => {
        // Проверяем, что это действительно новое значение извне
        if (
            externalMarkdown !== prevExternalMarkdownRef.current &&
            editorInstanceRef.current
        ) {
            prevExternalMarkdownRef.current = externalMarkdown;

            // Программно обновляем содержимое редактора
            editorInstanceRef.current.setMarkdown(externalMarkdown || '');
        }
    }, [externalMarkdown]);

    const handleChange = (newMarkdown: string) => {
        prevExternalMarkdownRef.current = newMarkdown;
        onChange?.(newMarkdown, true);
    };

    return (
        <MDXEditor
            ref={(instance) => {
                editorInstanceRef.current = instance;
                if (editorRef) {
                    if (typeof editorRef === 'function') {
                        editorRef(instance);
                    } else {
                        (
                            editorRef as React.MutableRefObject<MDXEditorMethods>
                        ).current = instance;
                    }
                }
            }}
            plugins={plugins}
            markdown={externalMarkdown} // Используем напрямую externalMarkdown
            onChange={handleChange}
            {...props}
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
