// Pipeline de integración continua: en cada push a GitHub construye las imágenes de los
// dos servicios, los levanta y verifica que se comuniquen por el nombre del servicio.
pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  // Jenkins revisa el repositorio cada 2 minutos y lanza el build si hay commits nuevos
  triggers {
    pollSCM('H/2 * * * *')
  }

  environment {
    // Nombre de proyecto, red y puerto propios para no chocar con el entorno local
    COMPOSE_PROJECT_NAME = 'proyecto-ci'
    RED_NOMBRE = 'red-proyecto-ci'
    API_PORT = '3010'
    POSTGRES_DB = 'tareas_db'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git log -1 --pretty="Commit %h de %an: %s"'
      }
    }

    stage('Build') {
      steps {
        // Las credenciales salen de Jenkins (id postgres-credenciales), nunca del código
        withCredentials([usernamePassword(credentialsId: 'postgres-credenciales',
                                          usernameVariable: 'DB_USUARIO',
                                          passwordVariable: 'DB_CLAVE')]) {
          sh '''
            printf 'POSTGRES_USER=%s\\nPOSTGRES_PASSWORD=%s\\nPOSTGRES_DB=%s\\n' \
              "$DB_USUARIO" "$DB_CLAVE" "$POSTGRES_DB" > .env
          '''
        }
        sh 'docker compose --profile pruebas build'
        sh 'docker image ls --format "{{.Repository}}:{{.Tag}}  {{.Size}}" | grep "^proyecto-ci-"'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker compose up -d --wait db api'
        sh 'docker compose ps'
      }
    }

    stage('Test') {
      steps {
        // Si alguna prueba falla, el comando termina con error y el build queda en rojo
        sh 'docker compose run --rm pruebas'
      }
    }
  }

  post {
    always {
      sh 'docker compose logs --no-color api db > logs-contenedores.txt || true'
      archiveArtifacts artifacts: 'logs-contenedores.txt', allowEmptyArchive: true
      sh 'docker compose --profile pruebas down -v --remove-orphans || true'
      sh 'rm -f .env'
    }
    success {
      echo 'Build exitoso: las imágenes se construyeron y los contenedores se comunican por el nombre del servicio.'
    }
    failure {
      echo 'Build fallido: revise la etapa en rojo y el archivo logs-contenedores.txt.'
    }
  }
}
