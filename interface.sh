#!/bin/bash

set -e

RESOURCES_FILE="src/typings/resources.ts"
DTS_FILE="src/typings/i18next.d.ts"

echo "Создание i18next.d.ts..."

if [ ! -f "$RESOURCES_FILE" ]; then
    echo "Ошибка: $RESOURCES_FILE не найден"
    exit 1
fi

INTERFACE_CONTENT=$(sed -n '/^interface Resources {/,/^}/p' "$RESOURCES_FILE")

if [ -z "$INTERFACE_CONTENT" ]; then
    echo "Не найден interface Resources"
    exit 1
fi

INTERFACE_BODY=$(echo "$INTERFACE_CONTENT" | sed '1d;$d')

{
    echo "declare module 'i18next' {"
    echo "    interface CustomTypeOptions {"
    echo "        resources: {"
    echo "$INTERFACE_BODY"
    echo "        };"
    echo "    }"
    echo "}"
} > "$DTS_FILE"

rm "${RESOURCES_FILE}

echo "✅ Готово! $DTS_FILE"