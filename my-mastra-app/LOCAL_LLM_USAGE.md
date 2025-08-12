# ローカルLLM対応 PR Quiz機能

このプロジェクトに、Google Geminiの代わりにOllamaを使用したローカルLLM対応のPR Quiz機能を追加しました。

## 前提条件

1. **Ollamaのインストール**
   ```bash
   # macOSの場合
   brew install ollama
   
   # または公式サイトからダウンロード
   # https://ollama.ai/
   ```

2. **LLMモデルのダウンロード**
   ```bash
   # Llama 3.1 8Bモデルをダウンロード
   ollama pull llama3.1:8b
   ```

3. **Ollamaサーバーの起動**
   ```bash
   ollama serve
   ```

## ファイル構成

### 新規追加されたファイル

- `src/mastra/agents/pr-quiz-agent-local.ts` - ローカルLLM版PRクイズエージェント
- `src/mastra/workflows/pr-quiz-workflow-local.ts` - ローカルLLM版PRクイズワークフロー  
- `src/mastra/mcp/pr-quiz-mcp-server-local.ts` - ローカルLLM版MCPサーバー
- `LOCAL_LLM_USAGE.md` - このファイル（使用方法説明）

### 既存ファイルの変更

- `package.json` - ollama-ai-providerの依存関係を追加
- `src/mastra/index.ts` - ローカルLLM版エージェント・ワークフローを登録

## 使用方法

### 1. 開発サーバーの起動
```bash
npm run dev
```

### 2. ワークフローの実行

Mastra開発UIまたはAPIエンドポイントから以下のワークフローを実行できます：

- **Google Gemini版**: `pr-quiz-workflow`
- **ローカルLLM版**: `pr-quiz-workflow-local`

### 3. 入力パラメータ

```json
{
  "prUrl": "https://github.com/owner/repo/pull/123"
}
```

### 4. 出力フォーマット

両バージョンとも同じ形式でクイズを生成します：

```json
{
  "multipleChoice": [
    {
      "question": "質問文",
      "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "correctOptionIndex": 0,
      "rationale": "解答の理由"
    }
  ],
  "shortAnswer": [
    {
      "question": "短答問題",
      "expectedPoint": "期待される回答のポイント"
    }
  ],
  "reflection": {
    "prompt": "設計トレードオフに関する考察問題"
  }
}
```

## MCPサーバーの使用

Claude Desktop等のMCPクライアントから使用する場合：

```bash
# ローカルLLM版MCPサーバーの起動
npx tsx src/mastra/mcp/pr-quiz-mcp-server-local.ts
```

## トラブルシューティング

1. **Ollamaサーバーが起動していない場合**
   ```bash
   ollama serve
   ```

2. **モデルが見つからない場合**
   ```bash
   ollama list  # インストール済みモデル確認
   ollama pull llama3.1:8b  # モデルのダウンロード
   ```

3. **メモリ不足の場合**
   - より軽量なモデルを使用: `llama3.1:7b` → `llama3.1:3b`
   - または `src/mastra/agents/pr-quiz-agent-local.ts` のモデル設定を変更

## 注意事項

- ローカルLLMはインターネット接続不要ですが、初回セットアップ時にはモデルのダウンロードが必要です
- Google Gemini版と比較して、ローカルLLMは処理速度やレスポンス品質が異なる場合があります
- Ollamaサーバーが起動していない状態でローカルLLM版を実行するとエラーになります