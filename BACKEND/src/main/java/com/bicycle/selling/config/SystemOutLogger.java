package com.bicycle.selling.config;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintStream;

public class SystemOutLogger {

    public static void init() throws Exception {
        File dir = new File("logs");

        if (!dir.exists()) {
            dir.mkdirs();
        }

        FileOutputStream fos = new FileOutputStream("logs/system-out.log", true);
        PrintStream ps = new PrintStream(fos);

        System.setOut(ps);
        System.setErr(ps);
    }
}