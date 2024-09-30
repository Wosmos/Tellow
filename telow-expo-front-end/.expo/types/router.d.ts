/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(call)` | `/(call)/` | `/(call)/join` | `/..\components\Room` | `/..\components\room` | `/_sitemap` | `/join` | `/sign-in` | `/sign-up`;
      DynamicRoutes: `/${Router.SingleRoutePart<T>}` | `/(call)/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(call)/[id]` | `/[id]`;
    }
  }
}
