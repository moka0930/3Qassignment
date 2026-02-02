import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:train/main.dart';

void main() {
  testWidgets('App test', (WidgetTester tester) async {
    // アプリを起動できることだけ確認
    await tester.pumpWidget(const MaterialApp(home: SimpleTrainingApp()));

    // 1フレーム進める（描画開始）
    await tester.pump();

    // Scaffold が出ている（最低限の画面構築が成功）
    expect(find.byType(Scaffold), findsOneWidget);

    // AppBarタイトルが出ている（appTitle を使っている前提）
    expect(find.text(appTitle), findsOneWidget);

    // タップしてもクラッシュしない（表示切替の正確性は見ない）
    await tester.tap(find.byType(GestureDetector));
    await tester.pump();
  });
}
