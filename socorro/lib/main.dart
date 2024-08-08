import 'package:flutter/material.dart';
import 'package:socorro/screens/base/base_screen.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
      options: const FirebaseOptions(
          apiKey: 'AIzaSyDqarsP-VJuyon8f0P10KSqB_eKdVA4e_I',
          projectId: 'socorrobd',
          storageBucket: 'socorrobd.appspot.com',
          messagingSenderId: '1038515213564',
          appId: '1:1038515213564:android:9a50f53ea45293634f7379'
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
