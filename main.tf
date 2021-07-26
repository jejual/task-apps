data "google_project" "demo-note-apps" {
  provider   = google
  project_id = "sinuous-tuner-303004"
}

provider "google" {
  credentials = file(var.creds)
  project     = "sinuous-tuner-303004"
  region      = "asia-southeast1"
  zone        = "asia-southeast1-a"
}

provider "google-beta" {
  credentials = file(var.creds)
  project     = "sinuous-tuner-303004"
  region      = "asia-southeast1"
  zone        = "asia-southeast1-a"
}

variable "creds" {
  type        = string
  description = "Application credential file path"
}

variable "dbuser" {
  type        = string
  description = "Application credential file path"
}

variable "dbpass" {
  type        = string
  description = "Application credential file path"
}

variable "dbsocket" {
  type        = string
  description = "Application credential file path"
}

# Read all secret in secret manager
data "google_secret_manager_secret_version" "db-user" {
  provider = google-beta
  secret   = "db-user"
}

data "google_secret_manager_secret_version" "db-pass" {
  provider = google-beta
  secret   = "db-pass"
}

data "google_secret_manager_secret_version" "db-connection-name" {
  provider = google-beta
  secret   = "db-connection-name"
}

# Deploy image to Cloud Run
resource "google_cloud_run_service" "demo-note-app" {

  provider = google
  name     = "demo-note-app"
  location = "asia-southeast1"

  autogenerate_revision_name = true

  template {
    spec {
      containers {
        image = "gcr.io/sinuous-tuner-303004/demo-note-apps"
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        env {
          name  = "DB_NAME"
          value = "note"
        }
        env {
          name  = "DB_DIALECT"
          value = "mysql"
        }
        env {
          name  = "DB_USER"
          value = var.dbuser
        }
        env {
          name  = "DB_PASSWORD"
          value = var.dbpass
        }
        env {
          name  = "DB_SOCKET_PATH"
          value = "/cloudsql/${var.dbsocket}"
        }
        # Next need to enable and fix problem to use secret env
        # env {
        #   name = "DB_USER"
        #   value_from {
        #     secret_key_ref {
        #       name = data.google_secret_manager_secret_version.db-user.secret_data
        #       key  = "latest"
        #     }
        #   }
        # }
        # env {
        #   name = "DB_PASSWORD"
        #   value_from {
        #     secret_key_ref {
        #       name = data.google_secret_manager_secret_version.db-pass.secret_data
        #       key  = "latest"
        #     }
        #   }
        # }
        # env {
        #   name = "DB_SOCKET_PATH"
        #   value_from {
        #     secret_key_ref {
        #       name = data.google_secret_manager_secret_version.db-connection-name.secret_data
        #       key  = "latest"
        #     }
        #   }
        # }
      }
    }

    metadata {
      annotations = {
        generated-by = "magic-modules"
        "run.googleapis.com/cloudsql-instances" = var.dbsocket
        "run.googleapis.com/client-name"        = "terraform"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    ignore_changes = [
      metadata.0.annotations,
    ]
  }
}
# Create public access
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Enable public access on Cloud Run service
resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.demo-note-app.location
  project     = google_cloud_run_service.demo-note-app.project
  service     = google_cloud_run_service.demo-note-app.name
  policy_data = data.google_iam_policy.noauth.policy_data
}
# Return service URL
output "url" {
  value = google_cloud_run_service.demo-note-app.status[0].url
}
