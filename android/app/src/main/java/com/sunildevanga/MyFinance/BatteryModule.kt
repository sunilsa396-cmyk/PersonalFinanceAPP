package com.sunildevanga.MyFinance

import android.content.*
import android.os.BatteryManager
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class BatteryModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

    private var batteryReceiver: BroadcastReceiver? = null

    override fun getName(): String = "BatteryModule"

    // Open battery optimization settings
    @ReactMethod
    fun openBatteryOptimizationSettings() {
        val intent = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactContext.startActivity(intent)
    }

    // Get battery level
    @ReactMethod
    fun getBatteryLevel(promise: Promise) {
        try {
            val bm = reactContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            val level = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
            promise.resolve(level)
        } catch (e: Exception) {
            promise.reject("BATTERY_ERROR", e.message)
        }
    }

    // Emit events to JS
    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    // Start listening to battery state
    private fun startBatteryReceiver() {
        if (batteryReceiver != null) return

        batteryReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                if (intent == null) return

                val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
                val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
                val batteryPct = (level / scale.toFloat() * 100).toInt()

                if (batteryPct <= 15) {
                    val params = Arguments.createMap()
                    params.putInt("level", batteryPct)
                    sendEvent("BatteryLow", params)
                }
            }
        }

        val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        reactContext.registerReceiver(batteryReceiver, filter)
    }

    private fun stopBatteryReceiver() {
        if (batteryReceiver != null) {
            reactContext.unregisterReceiver(batteryReceiver)
            batteryReceiver = null
        }
    }

    // Lifecycle hooks
    override fun initialize() {
        super.initialize()
        reactContext.addLifecycleEventListener(this)
        startBatteryReceiver()
    }

    override fun onCatalystInstanceDestroy() {
        stopBatteryReceiver()
        reactContext.removeLifecycleEventListener(this)
        super.onCatalystInstanceDestroy()
    }

    override fun onHostResume() {}
    override fun onHostPause() {}
    override fun onHostDestroy() {
        stopBatteryReceiver()
    }
}
