// CalendarModuleBridge.m
#import <React/RCTBridgeModule.h>

// Expose the Swift class & methods to RN
@interface RCT_EXTERN_MODULE(CalendarModule, NSObject)
RCT_EXTERN_METHOD(requestAccess:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addTransactionReminder:(NSString *)title
                  dateISO:(NSString *)dateISO
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
