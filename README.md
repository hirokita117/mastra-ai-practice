# mastra-ai-practice

mastra-ai を触ってみる

## リポジトリ構成

```
mastra-ai-practice/
├── README.md                 # このファイル
├── CLAUDE.md                 # Claude Code用の開発ガイドライン
├── log.md                    # 開発ログ
└── my-mastra-app/            # Mastraアプリケーション本体
    ├── package.json          # Node.js依存関係とスクリプト
    ├── package-lock.json     # 依存関係のロックファイル
    ├── tsconfig.json         # TypeScript設定
    └── src/
        └── mastra/           # Mastraアプリケーションのソースコード
            ├── index.ts      # Mastraインスタンスの設定
            ├── agents/       # AIエージェント定義
            │   └── weather-agent.ts    # 天気情報取得エージェント
            ├── tools/        # エージェントが使用するツール
            │   └── weather-tool.ts     # Open-Meteo API連携ツール
            └── workflows/    # ワークフロー定義
                └── weather-workflow.ts # 天気情報取得と活動計画ワークフロー
```

## 概要

このリポジトリは、Mastra AI フレームワークを使用したAIアプリケーションの実装例です。現在、天気情報を取得して活動計画を提案するサンプルアプリケーションが含まれています。

## 主な機能

- **AIエージェント**: Google Geminiモデルを使用したAIエージェント
- **ワークフロー**: 複数のステップを連携させた処理フロー
- **ツール統合**: Open-Meteo APIを使用した天気情報取得
- **型安全**: Zodスキーマによる入出力の型定義
