# 東海道往来 インタラクティブ朗読アプリケーション

- このプロジェクトは、江戸時代の「東海道五十三次」を題材にしたインタラクティブな朗読アプリケーションです。
- テキスト表示、音声録音・再生、地図表示の3つの機能がリアルタイムに同期し、ユーザーがまるで東海道を旅しているかのような没入感のある体験を提供します。

## ✨ 主要機能

- 📖 **テキスト表示**:
  - 縦書き・横書きの切り替え
  - 朗読箇所の自動ハイライト
  - フォントサイズ・種類の変更
  - ルビ表示のON/OFF

- 🎙️ **音声機能**:
  - ユーザーによる朗読の録音・再生
  - リアルタイムの音声波形表示
  - 再生速度の変更、5秒スキップ
  - 録音データのブラウザ内保存 (IndexedDB)

- 🗺️ **地図連動**:
  - 朗読の進行に合わせた宿場マーカーの自動追従
  - OpenStreetMapベースの地図表示
  - 宿場マーカークリックによるテキスト・音声へのジャンプ

- 🔄 **同期機能**:
  - テキスト、音声、地図のリアルタイム同期
  - 音声解析による自動タイムスタンプ生成

## 🛠️ 技術スタック

| カテゴリ           | 主要技術                               |
| ------------------ | -------------------------------------- |
| **フロントエンド** | React 18, TypeScript, Vite             |
| **状態管理**       | Zustand                                |
| **スタイリング**   | Tailwind CSS                           |
| **地図**           | Leaflet, React-Leaflet, OpenStreetMap  |
| **音声処理**       | Web Audio API, MediaRecorder, Wavesurfer.js |
| **データ永続化**   | IndexedDB (Dexie.js)                   |
| **テスト**         | Vitest                                 |
| **開発環境**       | Docker, VSCode Dev Containers          |
| **PWA**            | Workbox                                |

## 🏛️ アーキテクチャ

=本アプリケーションは、関心の分離を重視したクリーンアーキテクチャを採用しており、メンテナンス性と拡張性に優れています。

``` mermaid
graph TB
    subgraph "UI Layer (React Components)"
        direction LR
        MapView["MapView (地図)"]
        TextView["TextView (文章)"]
        AudioView["AudioView (音声)"]
    end
    
    subgraph "State Management (Zustand)"
        Store["useAppStore (一元管理)"]
    end

    subgraph "Application/Service Layer (Business Logic)"
        direction LR
        SyncService["SyncService (同期)"]
        AudioService["AudioService (録音/再生)"]
        MapService["MapService (地図操作)"]
        StorageService["StorageService (DBアクセス)"]
    end

    subgraph "Data Layer"
        direction LR
        IndexedDB["IndexedDB (録音データ等)"]
        StaticData["Static Assets (宿場/テキストデータ)"]
    end

    MapView & TextView & AudioView -- "状態の参照/アクションの実行" --> Store
    Store -- "状態の更新" --> MapView & TextView & AudioView
    Store -- "アクション経由で呼び出し" --> SyncService & AudioService & MapService & StorageService
    SyncService & AudioService & MapService & StorageService -- "状態を更新" --> Store
    SyncService & AudioService & MapService & StorageService -- "データの永続化/読み込み" --> IndexedDB & StaticData
```

## 📂 ディレクトリ構造と主要ファイル

プロジェクトの主要なファイルとディレクトリは以下の通りです。クリーンアーキテクチャの思想に基づき、関心事ごとにファイルが整理されています。

```
src
├── components/  # 機能(audio, map, text)ごとに整理されたUIコンポーネント
├── services/    # アプリケーションの核となるビジネスロジック
│   ├── AudioService.ts  # 録音・停止などの音声処理
│   ├── MapService.ts    # 地図の描画やマーカー操作
│   ├── SyncService.ts   # テキスト・音声・地図の同期ロジック
│   └── storage/       # IndexedDBへのデータ永続化
├── store/       # Zustandによるグローバルな状態管理
│   └── useAppStore.ts # 全体のStateとActionを定義
├── hooks/       # 再利用可能なUIロジック(カスタムフック)
├── constants/   # 宿場データなどの定数
├── types/       # TypeScriptの型定義
└── assets/      # 静的データ(テキスト原文など)やスタイル
```

## 🚀 セットアップと起動

開発環境にはDockerとVSCode Dev Containersの利用を強く推奨します。

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-org/tokaido-app.git
cd tokaido-app

# 2. Makefileを使った初期セットアップ (推奨)
# .envファイルのコピー、Dockerイメージのビルド、依存関係のインストールを自動で行います。
make setup

# 3. 開発コンテナの起動
make up
```

起動後、ブラウザで `http://localhost:5173` にアクセスしてください。

## 📜 主な開発コマンド (Makefile経由)

- `make up`: 開発環境を起動します。
- `make down`: 開発環境を停止します。
- `make logs`: アプリケーションのログを表示します。
- `make shell`: 開発コンテナのシェルにアクセスします。
- `make test`: Vitestによるテストを実行します。
- `make lint`: ESLintによるコード解析を実行します。
- `make format`: Prettierによるコードフォーマットを実行します。
- `make clean`: コンテナ、ボリューム、`node_modules`などを削除します。

## 📄 ライセンス

このプロジェクトはMITライセンスです。
`,

  'Dockerfile.dev': `FROM node:20-alpine AS base


## 主な変更点
### 概要の充実: 
- アプリケーションが提供する体験（没入感）について追記しました。
### 機能の具体化: 
- 各機能について、より具体的な内容を箇条書きで示しました。
### 技術スタックの表形式化: 
- 見やすさを向上させるため、技術スタックを表にまとめました。
### アーキテクチャ図の追加: 
- mermaid記法を用いて、システムの全体像が視覚的に理解できるアーキテクチャ図を追加しました。
### ディレクトリ構造の説明: 
- 主要なディレクトリとその役割を簡潔に説明し、コードベースの理解を助けるようにしました。
### セットアップ手順の明確化: 
- Makefileを使った推奨手順を前面に出し、コマンドの目的をコメントで補足しました。
### 開発コマンドの拡充: 
- Makefileで定義されている便利なコマンドを紹介し、開発体験の向上を図りました。
