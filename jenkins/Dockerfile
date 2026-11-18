# Jenkins LTS (Long Term Support) con Java 21, versión fija
FROM jenkins/jenkins:2.580.2-lts-jdk21

# Docker CLI y Docker Compose, con las mismas versiones del motor Docker del equipo,
# para que Jenkins pueda construir y levantar los contenedores del proyecto
COPY --from=docker:25.0.3-cli /usr/local/bin/docker /usr/local/bin/docker
COPY --from=docker/compose-bin:v2.24.6 /docker-compose /usr/libexec/docker/cli-plugins/docker-compose

# Plugins preinstalados (Git/GitHub, Pipeline, Docker Pipeline, configuración como código...)
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Configuración como código: usuario administrador, credenciales y job
COPY casc.yaml /usr/share/jenkins/casc.yaml
ENV CASC_JENKINS_CONFIG=/usr/share/jenkins/casc.yaml
# La configuración inicial la hace casc.yaml, así que se omite el asistente
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
