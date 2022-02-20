# インストール
```bash
npm install iii-validator
```

# 基本的な使い方
1. バリデーション対象の input / select / textarea 要素に `validate` クラスを付与
2. 1で `validate` クラスを付与した要素に `validations::xxxx` の形式で実行するバリデーションを指定
3. バリデーションを通過しなかった場合にエラーメッセージを表示する要素に `error-tip` クラスを付与
4. バリデーション対象要素と error-tip 要素を `form-group` クラスを付与した要素でラップ

例）
```html
<div class='form-group'>
    <input name='email' type='text' class='validate validations::empty'>
    <p class='error-tip'></p>
</div>
```

上記のように要素を準備したら {package-name} のインスタンスを生成  
```javascript
const Validator = new Validator()
```

あとは任意のタイミングで `validate` をトリガー  
```javascript
Validator.trigger('validate')
```
