#include <napi.h>
#include "juce_audio_processor.h"

class JUCEAudioProcessorWrapper : public Napi::ObjectWrap<JUCEAudioProcessorWrapper>
{
public:
    static Napi::Object Init(Napi::Env env, Napi::Object exports);
    JUCEAudioProcessorWrapper(const Napi::CallbackInfo& info);
    ~JUCEAudioProcessorWrapper();

private:
    static Napi::FunctionReference constructor;
    JUCEAudioProcessor* processor;
    
    Napi::Value SetPitchBend(const Napi::CallbackInfo& info);
    Napi::Value SetFlangerEnabled(const Napi::CallbackInfo& info);
    Napi::Value SetFlangerRate(const Napi::CallbackInfo& info);
    Napi::Value SetFlangerDepth(const Napi::CallbackInfo& info);
    Napi::Value SetFilterCutoff(const Napi::CallbackInfo& info);
    Napi::Value SetFilterResonance(const Napi::CallbackInfo& info);
    Napi::Value SetJogWheelPosition(const Napi::CallbackInfo& info);
    Napi::Value SetVolume(const Napi::CallbackInfo& info);
    Napi::Value ProcessAudio(const Napi::CallbackInfo& info);
};

Napi::FunctionReference JUCEAudioProcessorWrapper::constructor;

Napi::Object JUCEAudioProcessorWrapper::Init(Napi::Env env, Napi::Object exports)
{
    Napi::HandleScope scope(env);

    Napi::Function func = DefineClass(env, "JUCEAudioProcessor", {
        InstanceMethod("setPitchBend", &JUCEAudioProcessorWrapper::SetPitchBend),
        InstanceMethod("setFlangerEnabled", &JUCEAudioProcessorWrapper::SetFlangerEnabled),
        InstanceMethod("setFlangerRate", &JUCEAudioProcessorWrapper::SetFlangerRate),
        InstanceMethod("setFlangerDepth", &JUCEAudioProcessorWrapper::SetFlangerDepth),
        InstanceMethod("setFilterCutoff", &JUCEAudioProcessorWrapper::SetFilterCutoff),
        InstanceMethod("setFilterResonance", &JUCEAudioProcessorWrapper::SetFilterResonance),
        InstanceMethod("setJogWheelPosition", &JUCEAudioProcessorWrapper::SetJogWheelPosition),
        InstanceMethod("setVolume", &JUCEAudioProcessorWrapper::SetVolume),
        InstanceMethod("processAudio", &JUCEAudioProcessorWrapper::ProcessAudio)
    });

    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("JUCEAudioProcessor", func);
    return exports;
}

JUCEAudioProcessorWrapper::JUCEAudioProcessorWrapper(const Napi::CallbackInfo& info)
    : Napi::ObjectWrap<JUCEAudioProcessorWrapper>(info)
{
    try {
        // Initialize JUCE safely for Electron
        juce::initialiseJuce_GUI();
        processor = new JUCEAudioProcessor();
    } catch (const std::exception& e) {
        Napi::Error::New(info.Env(), "Failed to initialize JUCE: " + std::string(e.what())).ThrowAsJavaScriptException();
        return;
    }
}

JUCEAudioProcessorWrapper::~JUCEAudioProcessorWrapper()
{
    try {
        delete processor;
        juce::shutdownJuce_GUI();
    } catch (const std::exception& e) {
        // Silently handle cleanup errors
    }
}

Napi::Value JUCEAudioProcessorWrapper::SetPitchBend(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        float semitones = info[0].As<Napi::Number>().FloatValue();
        processor->setPitchBend(semitones);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setPitchBend: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::SetFlangerEnabled(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsBoolean()) {
        Napi::TypeError::New(env, "Boolean expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        bool enabled = info[0].As<Napi::Boolean>().Value();
        processor->setFlangerEnabled(enabled);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setFlangerEnabled: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::SetFlangerRate(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        float rate = info[0].As<Napi::Number>().FloatValue();
        processor->setFlangerRate(rate);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setFlangerRate: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::SetFlangerDepth(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        float depth = info[0].As<Napi::Number>().FloatValue();
        processor->setFlangerDepth(depth);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setFlangerDepth: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::SetFilterCutoff(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        float cutoff = info[0].As<Napi::Number>().FloatValue();
        processor->setFilterCutoff(cutoff);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setFilterCutoff: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::SetFilterResonance(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        float resonance = info[0].As<Napi::Number>().FloatValue();
        processor->setFilterResonance(resonance);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setFilterResonance: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::SetJogWheelPosition(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        float position = info[0].As<Napi::Number>().FloatValue();
        processor->setJogWheelPosition(position);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setJogWheelPosition: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::SetVolume(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        float volume = info[0].As<Napi::Number>().FloatValue();
        processor->setVolume(volume);
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in setVolume: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Value JUCEAudioProcessorWrapper::ProcessAudio(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    if (info.Length() < 1 || !info[0].IsArrayBuffer()) {
        Napi::TypeError::New(env, "ArrayBuffer expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    try {
        // For now, just return success - actual audio processing would go here
        // In a real implementation, you'd process the audio buffer
    } catch (const std::exception& e) {
        Napi::Error::New(env, "Error in processAudio: " + std::string(e.what())).ThrowAsJavaScriptException();
        return env.Null();
    }
    
    return env.Null();
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    return JUCEAudioProcessorWrapper::Init(env, exports);
}

NODE_API_MODULE(juce_audio_processor, Init)
