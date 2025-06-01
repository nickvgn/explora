#import "RCTNativeEventKit.h"

@interface RCTNativeEventKit()
@property (strong, nonatomic) EKEventStore *eventStore;
@end

@implementation RCTNativeEventKit

- (id) init {
  if (self = [super init]) {
    _eventStore = [[EKEventStore alloc] init];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeEventKitSpecJSI>(params);
}

- (NSString *)createEvent:(NSString *)title
                startDate:(NSString *)startDate
                  endDate:(NSString *)endDate
                 location:(NSString *)location
                    notes:(NSString *)notes
    reminderMinutesBefore:(NSNumber *)reminderMinutesBefore {
    
    @try {
        // Check if we have a default calendar
        EKCalendar *defaultCalendar = [self.eventStore defaultCalendarForNewEvents];
        if (!defaultCalendar) {
            NSLog(@"EventKit Error: No default calendar available");
            return nil;
        }
        
        // Create the event
        EKEvent *event = [EKEvent eventWithEventStore:self.eventStore];
        if (!event) {
            NSLog(@"EventKit Error: Failed to create event object");
            return nil;
        }
        
        event.title = title;
        
        // Parse YYYY-MM-DD format
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        formatter.dateFormat = @"yyyy-MM-dd";
        formatter.locale = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
        
        NSDate *parsedStartDate = [formatter dateFromString:startDate];
        NSDate *parsedEndDate = [formatter dateFromString:endDate];
        
        if (!parsedStartDate || !parsedEndDate) {
            NSLog(@"EventKit Error: Invalid date format. Expected YYYY-MM-DD. Start: %@, End: %@", startDate, endDate);
            return nil;
        }
        
        event.startDate = parsedStartDate;
        event.endDate = parsedEndDate;
        event.calendar = defaultCalendar;
        
        // Set location if provided
        if (location && location.length > 0) {
            event.location = location;
        }
        
        // Set notes if provided
        if (notes && notes.length > 0) {
            event.notes = notes;
        }
        
        // Add reminder if specified
        if (reminderMinutesBefore && [reminderMinutesBefore integerValue] > 0) {
            EKAlarm *alarm = [EKAlarm alarmWithRelativeOffset:-([reminderMinutesBefore integerValue] * 60)];
            if (alarm) {
                event.alarms = @[alarm];
            }
        }
        
        // Save the event
        NSError *error = nil;
        BOOL success = [self.eventStore saveEvent:event span:EKSpanThisEvent error:&error];
        
        if (error) {
            NSLog(@"EventKit Error: %@", error.localizedDescription);
            return nil;
        }
        
        if (success) {
            NSString *eventId = event.eventIdentifier;
            NSLog(@"EventKit Success: Event created with ID: %@", eventId);
            
            if (!eventId) {
                NSLog(@"EventKit Warning: Event created but ID is nil");
                return @"unknown";
            }
            
            return eventId;
        }
        
        NSLog(@"EventKit Error: Save returned false but no error");
        return nil;
        
    } @catch (NSException *exception) {
        NSLog(@"EventKit CRASH in createEvent: %@", exception);
        return nil;
    }
}

- (NSNumber *)deleteEvent:(NSString *)eventId {
    // Find the event by ID
    EKEvent *eventToDelete = [self.eventStore eventWithIdentifier:eventId];
    
    if (!eventToDelete) {
        NSLog(@"Event with ID %@ not found", eventId);
        return @NO;
    }
    
    // Delete the event
    NSError *error = nil;
    BOOL success = [self.eventStore removeEvent:eventToDelete span:EKSpanThisEvent error:&error];
    
    if (error) {
        NSLog(@"EventKit Delete Error: %@", error.localizedDescription);
        return @NO;
    }
    
    if (success) {
        NSLog(@"EventKit Success: Event deleted with ID: %@", eventId);
    }
    
    return success ? @YES : @NO;
}

+ (NSString *)moduleName {
  return @"NativeEventKit";
}

@end
