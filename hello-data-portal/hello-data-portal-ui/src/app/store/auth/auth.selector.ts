///
/// Copyright © 2024, Kanton Bern
/// All rights reserved.
///
/// Redistribution and use in source and binary forms, with or without
/// modification, are permitted provided that the following conditions are met:
///     * Redistributions of source code must retain the above copyright
///       notice, this list of conditions and the following disclaimer.
///     * Redistributions in binary form must reproduce the above copyright
///       notice, this list of conditions and the following disclaimer in the
///       documentation and/or other materials provided with the distribution.
///     * Neither the name of the <organization> nor the
///       names of its contributors may be used to endorse or promote products
///       derived from this software without specific prior written permission.
///
/// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
/// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
/// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
/// DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
/// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
/// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
/// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
/// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
/// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
/// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
///

import {AppState} from "../app/app.state";
import {createSelector} from "@ngrx/store";
import {AuthState} from "./auth.state";

const authState = (state: AppState) => state.auth;

export const selectIsAuthenticated = createSelector(
  authState,
  (state: AuthState) => state.isLoggedIn
);

export const selectProfile = createSelector(
  authState,
  (state: AuthState) => state.profile
);

export const selectIsSuperuser = createSelector(
  authState,
  (state: AuthState) => state.isSuperuser
);

export const selectCurrentUserPermissions = createSelector(
  authState,
  (state: AuthState) => state.permissions
);

export const selectCurrentUserPermissionsLoaded = createSelector(
  authState,
  (state: AuthState) => state.permissionsLoaded
);

export const selectCurrentBusinessDomain = createSelector(
  authState,
  (state: AuthState) => state.businessDomain
);

export const selectCurrentContextRoles = createSelector(
  authState,
  (state: AuthState) => state.contextRoles
);

export const selectCurrentContextRolesFilterOffNone = createSelector(
  authState,
  (state: AuthState) => state.contextRoles.filter((contextRole: any) => contextRole?.role?.name != 'NONE')
);

export const selectDisableLogout = createSelector(
  authState,
  (state: AuthState) => state.disableLogout
);

export const selectSupportedLanguages = createSelector(
  authState,
  (state: AuthState) => state.supportedLanguages
);

export const selectSelectedLanguage = createSelector(
  authState,
  (state: AuthState) => {
    if (!state.selectedLanguage) {
      const browserLanguage = navigator.language.replace('-', '_');
      if (state.supportedLanguages.includes(browserLanguage)) {
        return browserLanguage;
      } else {
        return state.defaultLanguage;
      }
    }
    return state.selectedLanguage
  }
);
