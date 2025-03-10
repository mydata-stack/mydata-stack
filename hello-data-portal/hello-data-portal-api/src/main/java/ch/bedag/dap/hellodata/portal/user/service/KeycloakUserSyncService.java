/*
 * Copyright © 2024, Kanton Bern
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package ch.bedag.dap.hellodata.portal.user.service;

import ch.bedag.dap.hellodata.portalcommon.user.entity.UserEntity;
import ch.bedag.dap.hellodata.portalcommon.user.repository.UserRepository;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@AllArgsConstructor
public class KeycloakUserSyncService {

    private final KeycloakService keycloakService;
    private final UserRepository userRepository;

    /**
     * Checks if any of keycloak users has a changed id (e.g: user removed directly in the keycloak and then added again)
     */
    @Scheduled(fixedDelayString = "${hello-data.auth-server.sync-users-schedule-seconds}", timeUnit = TimeUnit.SECONDS)
    public void syncUsers() {
        List<UserRepresentation> allUsers = keycloakService.getAllUsers();
        List<UserEntity> allPortalUsers = userRepository.findAll();
        for (UserRepresentation userRepresentation : allUsers) {
            UserEntity userEntity = allPortalUsers.stream().filter(user -> user.getEmail().equalsIgnoreCase(userRepresentation.getEmail())).findFirst().orElse(null);
            if (userEntity != null) {
                if ((userEntity.getAuthId() == null && !userRepresentation.getId().equalsIgnoreCase(userEntity.getId().toString())) ||
                    (userEntity.getAuthId() != null && !userRepresentation.getId().equalsIgnoreCase(userEntity.getAuthId()))) {

                    userEntity.setAuthId(userRepresentation.getId());
                    userRepository.saveAndFlush(userEntity);
                    log.info("Updated auth id for user {}, user id: {}, user auth_id: {}", userEntity.getEmail(), userEntity.getId(), userRepresentation.getId());
                }
            }
        }
    }
}
