import 'package:flutter/material.dart';
import 'package:socorro/screens/base/base_screen.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
      options: const FirebaseOptions(
          apiKey: String.fromEnvironment(('FIREBASE_API_KEY')),
          projectId: String.fromEnvironment(('FIREBASE_PROJECT_ID')),
          storageBucket: String.fromEnvironment(('FIREBASE_STORAGE_BUCKET')),
          messagingSenderId: String.fromEnvironment(('FIREBASE_MESSAGING_SENDER_ID')),
          appId: String.fromEnvironment(('FIREBASE_APP_ID'))
      )
  );

  runApp( MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SOCORRO',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color.fromARGB(255, 4, 125, 141),
        scaffoldBackgroundColor: const Color.fromARGB(255, 15, 22, 38),
        appBarTheme: const AppBarTheme(
          elevation: 0,
        ),
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: BaseScreen(),
    );
  }
}
