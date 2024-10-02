/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/forgot-password` | `/(auth)/password-reset` | `/(auth)/sign-in` | `/(auth)/sign-up` | `/(auth)/success` | `/(auth)/verify-code` | `/(call)` | `/(call)/` | `/(call)/join` | `/_sitemap` | `/forgot-password` | `/join` | `/lib/slugs` | `/password-reset` | `/sign-in` | `/sign-up` | `/success` | `/verify-code`;
      DynamicRoutes: `/${Router.SingleRoutePart<T>}` | `/(call)/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(call)/[id]` | `/[id]`;
    }
  }
}
