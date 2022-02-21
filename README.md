# インストール
```bash
npm install iii-validator
```

<br>
<br>
<br>
<br>
<br>

# 基本的な使い方
1. バリデーション対象の input / select / textarea 要素に `validate` クラスを付与
2. 1で `validate` クラスを付与した要素に `validations::xxxx` の形式で実行するバリデーションを指定
3. バリデーションを通過しなかった場合にエラーメッセージを表示する要素を用意し `error-tip` クラスを付与
4. バリデーション対象要素と error-tip 要素を `form-group` クラスを付与した要素でラップ

例）
```html
<div class='form-group'>
    <input name='email' type='text' class='validate validations::empty'>
    <p class='error-tip'></p>
</div>
```

上記のように要素を準備したら iii-validator のインスタンスを生成  
```javascript
import ValidatorInitializer from 'iii-validator'
const Validator = new ValidatorInitializer()
```

あとは任意のタイミングで `validate` をトリガー  
```javascript
element.addEventListener('click', () => Validator.trigger('validate'))
```

<br>
<br>
<br>
<br>
<br>

# ひとつのフォームに複数のバリデーションを実行したい場合
`validations::` のあとに `:` 区切りでバリデーション名を列挙

例）
```html
<div class='form-group'>
    <input name='email' type='text' class='validate validations::empty:email'>
    <p class='error-tip'></p>
</div>
```

<br>
<br>
<br>
<br>
<br>

# error-tip のスタイル
'validate' がトリガーされたあと、エラーとなった form-group 内の error-tip 内にはエラーメッセージが追加されますので `.error-tip` に任意のスタイルを定義してください。

<br>
<br>
<br>
<br>
<br>

# エラーとなった要素のスタイル
'validate' がトリガーされたあと、エラーとなったバリデーション対象要素には `is-invalid` クラスが付与されますので `.is-invalid` に任意のスタイルを定義してください。

<br>
<br>
<br>
<br>
<br>

# 実装済みバリデーションと使用方法一覧
## 【empty】
### 概要
入力必須項目のバリデーションです。

### 使用方法
バリデーション対象要素に `validations::empty` クラスを付与します。

<br>
<br>
<br>

## 【multipleEmpty】
### 概要
複数のバリデーション対象要素において、少なくともいずれかひとつに入力が必要な場合のバリデーションです。

### 使用方法
1. 複数のバリデーション対象要素に `validations::multipleEmpty` クラスを付与します。
2. 1で対象とした各要素に `multipleEmptyGroup::{groupId}` クラスを付与します。 ※{groupId} には各要素共通の文字列を指定
3. 1で対象とした各要素にエラーメッセージで表示する名前を `multipleEmptyName::{name}` クラスを付与します。 ※{name} は日本語使用可能

### 使用例
```html
<div class='form-group'>
    <div class='flex'>
        <label>名前</label>
        <div>
            <input name='name' type='text' class='validate validations::multipleEmpty multipleEmptyGroup::profile multipleEmptyName::名前'>
            <p class='error-tip'></p>
        </div>
    </div>
    <div class='flex'>
        <label>メールアドレス</label>
        <div>
            <input name='email' type='text' class='validate validations::multipleEmpty multipleEmptyGroup::profile multipleEmptyName::メールアドレス'>
            <p class='error-tip'></p>
        </div>
    </div>
</div>
```

上記の状態でエラーとなった場合 `名前、メールアドレスのいずれかの入力は必須です。` とエラーメッセージが表示されます。

<br>
<br>
<br>

## 【email】
### 概要
メールアドレス形式のバリデーションです。

### 使用方法
バリデーション対象要素に `validations::email` クラスを付与します。

<br>
<br>
<br>

## 【confirmation】
### 概要
メールアドレスや新規パスワード設定時などで使用する、確認入力時のバリデーションです。  
入力値が確認元に指定した要素の値と異なる場合はエラーとなります。

### 使用方法
1. バリデーション対象要素に `validations::confirmation` クラスを付与します。
2. 1で対象とした要素に `confirmationBase::{name}` クラスを付与します。 ※{name} には確認元の要素のname属性の文字列を指定

### 使用例
```html
<div class='form-group'>
    <input name='email' type='text' class='validate validations::empty:email'>
    <p class='error-tip'></p>
</div>
<div class='form-group'>
    <input name='email_confirmation' type='text' class='validate validations::confirmation confirmationBase::email'>
    <p class='error-tip'></p>
</div>
```

<br>
<br>
<br>

## 【minimumCharacters】
### 概要
最小文字数のバリデーションです。

### 使用方法
バリデーション対象要素に `validations::minimumCharacters-{number}` クラスを付与します。 ※{number} には最小文字数を指定

### 使用例
8文字未満の場合にエラーとなる場合の例
```html
<div class='form-group'>
    <input name='password' type='password' class='validate validations::minimumCharacters-8'>
    <p class='error-tip'></p>
</div>
```

<br>
<br>
<br>

## 【maximumCharacters】
### 概要
最大文字数のバリデーションです。

### 使用方法
バリデーション対象要素に `validations::maximumCharacters-{number}` クラスを付与します。 ※{number} には最大文字数を指定

### 使用例
16文字を超える場合にエラーとなる場合の例
```html
<div class='form-group'>
    <input name='password' type='password' class='validate validations::maximumCharacters-16'>
    <p class='error-tip'></p>
</div>
```

<br>
<br>
<br>

## 【charactersRange】
### 概要
xx文字以上、yy文字以下のバリデーションです。

### 使用方法
バリデーション対象要素に `validations::charactersRange-{min}-{max}` クラスを付与します。 ※{min} には最小文字数、 {max}に最大文字数を指定

### 使用例
8文字未満または16文字を超える場合にエラーとなる場合の例
```html
<div class='form-group'>
    <input name='password' type='password' class='validate validations::charactersRange-8-16'>
    <p class='error-tip'></p>
</div>
```

<br>
<br>
<br>

## 【halfWidthNumber】
### 概要
半角英数字のバリデーションです。

### 使用方法
バリデーション対象要素に `validations::halfWidthNumber` クラスを付与します。

<br>
<br>
<br>

## 【katakana】
### 概要
全角カタカナのバリデーションです。

### 使用方法
バリデーション対象要素に `validations::katakana` クラスを付与します。

<br>
<br>
<br>

## 【hiragana】
### 概要
ひらがなのバリデーションです。

### 使用方法
バリデーション対象要素に `validations::hiragana` クラスを付与します。

<br>
<br>
<br>
