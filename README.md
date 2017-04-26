# Inject-MathJax

任意のWebページにMathJaxを読み込ませてtexによる数式表現を化膿するChromium, Google Chrome向けブラウザー拡張。

# インストール

~~~
git clone
vim whitelist_urls.conf
make
~~~

してからChromiumにインストールする。

whitelist_urls.confには一行にひとつ、MathJaxを読み込ませたいURLをマッチパターンで記述する

[Chromiumのマッチパターン](https://developer.chrome.com/extensions/match_patterns)


# 特徴

このブラウザー拡張はwhitelist_url.confに記述したマッチパターンのURLに対し、

1. CSP(Content Security Policy)を無効化する
1. MathJaxをロードする
1. MathJaxを定期的に呼び出す

という処理を行う。

# 類似のブラウザー拡張より優れている点

すでに類似機能を提供しているブラウザー拡張があるが、コンピューターリテラシーのないユーザーのためにあまり洗練されていない実装になっている。

CSPの普及により、多くのWebサイトでは外部ドメインのスクリプトがロードできなくなっている。CDN経由でMathJaxをロードするには、まずCSPを無効化しなければならない。CSPはセキュリティを向上させるものであり、不必要に無効化すべきではない。そのため、MathJaxをロードする必要があるURLのみ無効化すべきだ。

Chromium, Google ChromeでCSPを無効化するには、レスポンスヘッダーをブラウザーが解釈する前に改変するブラウザー拡張用の機能を使う。そしてCSPの部分を削除する。

これは以下のようなコードになる。

~~~javascript
for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {
        details.responseHeaders[i].value = '';
        // 実際にはCDNを追加するのでもう少しマシ
    }
}
~~~

巷に出回っているブラウザー拡張は、このレスポンスヘッダーからCSPを削除するためのコールバック関数を、すべてのURLに対して読み出す。そして、自薦に設定したURLのみに適用するように条件分岐する。

~~~javascript
function( details ) {

    if ( !is_whiltelist_urls(details.url) )
        return ;
}
~~~

ブラウザー拡張側のコードでURLを判定している。

理想的には、ブラウザー拡張のmanifest.jsonのpermissionsで適用されるURLを厳しく指定すべきだ。しかし、そのためにはユーザーがmanifest.jsonを変更する必要がある。

このブラウザー拡張は、whitelist_urls.confに記述されたマッチパターンをpermissionsにもつmanifest.jsonを生成して、ブラウザー拡張をユーザーが作るようになっている。
