/* =========================================================
   ここだけ編集すれば、行き先と写真を差し替えられます

   ■ 行き先
     amazonListUrl : 出品一覧の URL（https:// で始まるもの）

   ■ 写真（ページを開くたびに、各フォルダーからランダムに選ばれます）
     hero           … 4:5   ファーストビュー（PC・スマホ共通）
     wideLandscape  … 16:9  PC の山場・横長の 6 か所
     widePortrait   … 4:5   PC の山場・縦長の 2 か所／スマホの山場 8 か所
     scenePc        … 16:9  PC の左右交互のシーン
     sceneSp        … 4:5   スマホの左右交互のシーン／作品の棚（PC・スマホ共通）

     写真を増やしたときは、ファイルを連番で追加して count の数字を変えるだけです。
     番号は 001 から抜けなく連番にしてください。
     path は images/ のような同じフォルダー内の場所、または https:// で始まる URL（最後に / を付ける）
   ========================================================= */
window.LP_CONFIG = {
  amazonListUrl: 'https://link.amazon/B0dc5jBRW',

  // 先着100名様おまけDVDプレゼントのシーンを表示するか
  // プレゼントが終了したら false にしてください。5 か所まとめて消えます
  promo: true,

  images: {
    hero:          { path: 'images/hero/',           prefix: 'hero-',           count: 13,  ext: '.webp' },
    wideLandscape: { path: 'images/wide-landscape/', prefix: 'wide-landscape-', count: 10,  ext: '.webp' },
    widePortrait:  { path: 'images/wide-portrait/',  prefix: 'wide-portrait-',  count: 11,  ext: '.webp' },
    scenePc:       { path: 'images/scene-pc/',       prefix: 'scene-pc-',       count: 43,  ext: '.webp' },
    sceneSp:       { path: 'images/scene-sp/',       prefix: 'scene-sp-',       count: 279, ext: '.webp' }
  }
};
