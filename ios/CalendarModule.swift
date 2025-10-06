// CalendarModule.swift
import Foundation
import EventKit

@objc(CalendarModule)
class CalendarModule: NSObject {
  private let store = EKEventStore()

  // Expose a promise-based requestAccess(selector) for RN
  // Note: selector must match the RCT_EXTERN_METHOD in the bridge .m file
  @objc(requestAccess:rejecter:)
  func requestAccess(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    store.requestAccess(to: .event) { granted, error in
      if let err = error {
        reject("calendar_error", err.localizedDescription, err)
        return
      }
      resolve(granted)
    }
  }

  // Add a calendar event / reminder for the transaction
  @objc(addTransactionReminder:dateISO:resolver:rejecter:)
  func addTransactionReminder(_ title: NSString,
                              dateISO: NSString,
                              resolver resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
    // parse ISO date
    let formatter = ISO8601DateFormatter()
    guard let date = formatter.date(from: dateISO as String) else {
      reject("invalid_date", "Date not in ISO format", nil)
      return
    }

    let event = EKEvent(eventStore: store)
    event.title = title as String
    event.startDate = date
    event.endDate = date.addingTimeInterval(60 * 60) // 1 hour event
    event.calendar = store.defaultCalendarForNewEvents

    // optional: add an alarm 10 minutes before
    let alarm = EKAlarm(relativeOffset: -10 * 60)
    event.alarms = [alarm]

    do {
      try store.save(event, span: .thisEvent)
      resolve(["id": event.eventIdentifier ?? ""])
    } catch let error {
      reject("save_error", error.localizedDescription, error)
    }
  }

  // RN boilerplate: not required but good to add
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
