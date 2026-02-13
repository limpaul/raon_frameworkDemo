package com.example.myapplication

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var ctrlViewButton: Button
    private lateinit var fullViewButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        ctrlViewButton = findViewById<Button>(R.id.ctrlViewBtn)
        fullViewButton = findViewById<Button>(R.id.fullViewBtn)

        ctrlViewButton.setOnClickListener {
            val intent = Intent(this, CtrlViewAcitivty::class.java)
            startActivity(intent)
        }
    }
}