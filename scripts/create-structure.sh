#!/bin/bash
# scripts/create-structure.sh

# プロジェクトルートディレクトリの作成
echo "📁 プロジェクトディレクトリ構造を作成中..."

# srcディレクトリ構造の作成
mkdir -p src/components/{common,text,audio,map,layout}
mkdir -p src/services/{audio,map,sync,storage}
mkdir -p src/store/{slices,types}
mkdir -p src/{hooks,utils,types,constants}
mkdir -p src/assets/{data,styles}

# その他のディレクトリ
mkdir -p public/{icons,fonts}
mkdir -p tests/{unit,integration,e2e}
mkdir -p config
mkdir -p scripts
mkdir -p .devcontainer
mkdir -p .github/workflows

# 基本ファイルの作成
touch src/App.tsx
touch src/main.tsx
touch src/index.css

# 各ディレクトリにindex.tsファイルを作成
find src -type d -exec sh -c 'echo "// Export modules from $(basename {})" > {}/index.ts' \;

# READMEファイルを各主要ディレクトリに作成
echo "# UIコンポーネント" > src/components/README.md
echo "# ビジネスロジックサービス" > src/services/README.md
echo "# 状態管理" > src/store/README.md
echo "# カスタムフック" > src/hooks/README.md
echo "# ユーティリティ関数" > src/utils/README.md
echo "# 型定義" > src/types/README.md
echo "# 定数定義" > src/constants/README.md
echo "# 静的ファイル" > src/assets/README.md
echo "# テスト" > tests/README.md

echo "✅ ディレクトリ構造の作成が完了しました"

# ディレクトリ構造の確認
echo ""
echo "📊 作成されたディレクトリ構造:"
tree -d -L 3 . 2>/dev/null || find . -type d -maxdepth 3 | sort
