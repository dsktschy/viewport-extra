# Next.js (App Router) アプリケーションでの使用例

[English](./README.md) | **日本語**

この例では、[Next.js (App Router)](https://nextjs.org/docs/app) アプリケーションで Viewport Extra を使用する方法を示します。

## 注意

デスクトップ向けブラウザの開発者ツールで動作を確認する場合、Viewport Extra を使用するページへ移動するよりも先に、モバイル端末のシミュレーションを有効化し、ビューポートを目的のサイズに設定しておく必要があります。順番が逆である場合、ブラウザが `<meta name="viewport">` 要素の `initial-scale` の設定を無視してしまう状態となります。これは、開発者ツールのシミュレーションに特有の現象であり、実際のモバイル向けブラウザでは発生しません。
