declare module 'bem-cn-lite' {
    interface Modifications {
        [key: string]: string | boolean | undefined;
    }

    interface Block {
        (
            elementName: string,
            modifiers?: Modifications | null,
            mixin?: string | string[]
        ): string;
        (elementName?: string, mixin?: string | string[]): string;
        (modifiers?: Modifications | null): string;
    }

    function block(blockName: string): Block;
    export default block;
}
