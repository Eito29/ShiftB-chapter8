"use client"
import React, { useState } from 'react'

//【　メモ　】
// (e)って何かわからないからanyにするで？となるので明示する
// 　onSubmit	React.FormEvent<HTMLFormElement>
// 　onChange	React.ChangeEvent<HTMLInputElement>
// 　onClick	React.MouseEvent<HTMLButtonElement>

//【　送信の流れメモ　】
// onChange（e.target.value で useState 更新）
// 　↓
// submitクリック
// 　↓
// handleSubmit 発火
// 　↓
// try の中に入る
// 　↓
// e.preventDefault()
// 　↓
// valid()
// 　↓
// OK なら fetch で JSON を送信
// 　↓
// 完了メッセージ → クリア

//【　try catchが必要な場面　】
// fetch（API通信）
// ログイン処理
// ファイル読み込み
// データ変換(JSON parse)

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const [loading, setLoading] = useState(false); // 送信中に操作させないための管理用

  // バリデーション
  const valid = () => {
    let isValid = true;
    let nameError = "";
    let emailError = "";
    let messageError = "";

    if (!name) {
      nameError = "お名前は必須です。"
      isValid = false
    } else if (name.length > 30) {
      nameError = "お名前は30文字以内で入力してください。"
      isValid = false
    };

    if (!email) {
      emailError = "メールアドレスは必須です。"
      isValid = false
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      emailError = "メールアドレスの形式が正しくありません。"
      isValid = false
    };

    if (!message) {
      messageError = "本文は必須です。"
      isValid = false
    } else if (message.length > 500) {
      messageError = "本文は500文字以内で入力してください。"
      isValid = false
    };

    setNameError(nameError);
    setEmailError(emailError);
    setMessageError(messageError);

    return isValid;
  }

  // 送信
  // formが送信された時のイベント」の型。
  // FormEvent　→　フォームで起きるイベントの型。
  // <HTMLFormElement>　→　<form> ... </form>を示す
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ブラウザのデフォルト動作（画面リロード）を止める
    if (!valid()) return // 入力が正しいかをチェックして、間違いがあれば送信しない。

    try { // この中のコードを実行してみる
      setLoading(true); // 送信開始

      await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts`, { // OKならAPIにデータ送信
        method: 'POST', // 「データを新規登録したい」という意味のメソッド（もし取得なら GET、削除なら DELETE など）
        headers: {'Content-Type': 'application/json',}, // サーバーにJSON形式で送る宣言
        body: JSON.stringify({ name, email, message }), //bodyは【実際に送る中身】で、JSON.stringifyは【オブジェクト → JSON文字列に変換】
      })

      alert("送信しました");

      handleClear();
    } catch (error) { // 失敗したらここに来る。エラー内容は error に入る
      console.error(error);
      alert("エラーが発生したため、送信できませんでした");
    } finally {
      setLoading(false); // 送信終了
    }
  };

  // クリア
  const handleClear = () => {
    setName("")
    setEmail("")
    setMessage("")
  };

  return (
    <div className='container'>
      <h1 className='text-xl font-bold mb-5'>お問い合わせフォーム</h1>

      <form onSubmit={handleSubmit}>
        <div className='flex items-center justify-between mb-5'>
          <div className='w-[250px]'>お名前</div>
          <div className='w-full'>
            <input type='text' name='name' value={name} onChange={(e) => setName(e.target.value)} disabled={loading} className="w-full p-4 border border-solid border-gray-300 rounded" />

            {/* nameErrorがfalseなら<p>{nameError}</p>を表示する */}
            {nameError && (<p className='text-sm text-red-700'>{nameError}</p>)}
          </div>
        </div>

        <div className='flex items-center justify-between mb-5'>
          <div className='w-[250px]'>メールアドレス</div>
          <div className='w-full'>
            <input type='text' name='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="w-full p-4 border border-solid border-gray-300 rounded" />
            {emailError && (<p className='text-sm text-red-700'>{emailError}</p>)}
          </div>
        </div>

        <div className='flex items-center justify-between mb-7'>
          <div className='w-[250px]'>本文</div>
          <div className='w-full'>
            {/* rows="8"　→　TSではrows={8} にしてnumber型に書き換える*/}
            <textarea rows={8} name='message' value={message} onChange={(e) => setMessage(e.target.value)} disabled={loading} className="w-full p-4 border border-solid border-gray-300 rounded" />
            {messageError && (<p className='text-sm text-red-700'>{messageError}</p>)}
          </div>
        </div>

        <div className='flex items-center justify-center gap'>
          <button type='submit' disabled={loading} className='mr-4 px-4 py-2 rounded-lg bg-gray-800 text-white font-bold'>送信</button>
          <button type='button' onClick={handleClear} disabled={loading} className='py-2 px-4 rounded-lg bg-gray-200 font-bold'>クリア</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
