import 'dart:math';
import 'package:flutter/material.dart';

void main() {
  runApp(const MaterialApp(home: SimpleTrainingApp()));
}

class Sample {
  final String imageUrl;
  final String answer;
  Sample(this.imageUrl, this.answer);

  factory Sample.fromList(List<String> list) {
    return Sample(list[0], list[1]);
  }
}

class SimpleTrainingApp extends StatefulWidget {
  const SimpleTrainingApp({super.key});
  @override
  State<SimpleTrainingApp> createState() => _SimpleTrainingAppState();
}

const String appTitle = '犬種判別トレーニング';

class _SimpleTrainingAppState extends State<SimpleTrainingApp> {
  final List<List<String>> data = [
    ["image/コーギー.jpg", "〇 コーギ"],
    ["image/シュナウザー.webp", "〇 シュナウザー"],
    ["image/ダックスフンド（スムース）.jpeg", "〇 ミニチュアダックスフンド（スムース）"],
    ["image/チワワ.jpg", "〇 チワワ"],
    ["image/ラブラドールレトリーバー.jpg", "〇 ラブラドールレトリーバー"],
    ["私の愛犬(モカ).jpg", "〇 私の愛犬（トイプードル）"],
    ["image/ダックスフンド（ロング）.jpg", "〇 ミニチュアダックスフンド（ロング）"],
    ["image/ヨークシャーテリア.jpg", "〇 ヨークシャーテリア"],
    ["image/ダックスフンド（ワイヤー）.jpg", "〇 ミニチュアダックスフンド（ワイヤー）"],
    ["image/柴.webp", "〇 柴"],
    ["image/ポメラリアン.jpg", "〇 ポメラリアン"],
  ];

  late final List<Sample> _samples;
  int _index = 0;
  bool _showAnswer = false;

  @override
  void initState() {
    super.initState();
    _samples = data.map((e) => Sample.fromList(e)).toList();
    _samples.shuffle(Random());
  }

  void _onTap() {
    setState(() {
      if (_showAnswer) {
        _showAnswer = false;

        // 最後まで行ったら再シャッフルして先頭へ
        if (_index == _samples.length - 1) {
          _samples.shuffle(Random());
          _index = 0;
        } else {
          _index++;
        }
      } else {
        _showAnswer = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_samples.isEmpty) {
      return const Scaffold(body: Center(child: Text('データがありません')));
    }

    final sample = _samples[_index];

    return Scaffold(
      appBar: AppBar(
        title: const Text(appTitle),
      ),
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: _onTap,
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.network(
                sample.imageUrl,
                // fit: BoxFit.cover,// 画面いっぱいに広げる代わりに上下左右が切れる
                fit: BoxFit.contain, // 画像全体が必ず画面内に収まる（余白が出ることはあるが切れない）
                loadingBuilder: (c, w, p) => p == null ? w : const Center(child: CircularProgressIndicator()),
                errorBuilder: (e1, e2, e3) => const Center(child: Text('画像を読み込めません')),
              ),
            ),

            if (_showAnswer)
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: Container(
                  color: Colors.black54,
                  padding: const EdgeInsets.all(20),
                  child: Text(
                    sample.answer,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),

            Positioned(
              top: 10,
              right: 10,
              child: _hint(_showAnswer ? 'タップで次へ' : 'タップで正解表示'),
            ),

            Positioned(
              top: 10,
              left: 10,
              child: _hint('${_index + 1}/${_samples.length}'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _hint(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.black45,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(text, style: const TextStyle(color: Colors.white)),
    );
  }
}
