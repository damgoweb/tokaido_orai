# Makefile for 東海道往来アプリ

.PHONY: help setup structure up down build logs shell clean test lint format

help:
	@echo "使用可能なコマンド:"
	@echo "  make setup      - 完全な初期セットアップ"
	@echo "  make structure  - ディレクトリ構造の作成"
	@echo "  make up         - 開発環境起動"
	@echo "  make down       - 開発環境停止"
	@echo "  make build      - イメージ再ビルド"
	@echo "  make logs       - ログ表示"
	@echo "  make shell      - コンテナにログイン"
	@echo "  make clean      - クリーンアップ"
	@echo "  make test       - テスト実行"
	@echo "  make lint       - リント実行"
	@echo "  make format     - コードフォーマット"

setup: structure
	@echo "🚀 初期セットアップを開始..."
	@cp -n .env.example .env || true
	@docker-compose build --no-cache
	@docker-compose run --rm app npm ci
	@echo "✅ セットアップ完了"
	@echo "📌 'make up' で開発サーバーを起動してください"

structure:
	@echo "📁 ディレクトリ構造を作成中..."
	@node scripts/create-complete-structure.cjs

up:
	@docker-compose up -d
	@echo "🌐 開発サーバー起動: http://localhost:5173"

down:
	@docker-compose down

build:
	@docker-compose build --no-cache

logs:
	@docker-compose logs -f app

shell:
	@docker-compose exec app sh

clean:
	@docker-compose down -v
	@rm -rf node_modules dist .turbo
	@echo "🧹 クリーンアップ完了"

test:
	@docker-compose exec app npm test

lint:
	@docker-compose exec app npm run lint

format:
	@docker-compose exec app npm run format
