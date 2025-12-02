#!/bin/bash

echo "Название модуля: "
read module

# Алгоритм перевода UpperCase в kebab-case
block_name=$(echo "$module" | sed 's/\([A-Z]\)/-\L\1/g' | sed 's/^-//')

if [ -d "$module" ]; then
    echo "Папка уже существует"
else 
    mkdir "$module"
    cd "$module"
fi

touch "$module.tsx"
touch "$module.scss"
touch "index.ts"

echo "export {$module} from './$module'" > "index.ts"

echo ".$block_name{}" > "${module}.scss"


cat > "$module.tsx" << EOF
import block from 'bem-cn-lite'

import './$module.scss'

const b = block('$block_name')

export const $module = () => {
    return (
        
    )
}
EOF
