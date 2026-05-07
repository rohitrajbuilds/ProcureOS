# ProcureOS AWS Deployment

For maximum AWS free-credit efficiency, the recommended path is now:

- one small EC2 instance
- Docker Compose
- SQLite persistence
- Nginx reverse proxy

This avoids the recurring managed-service cost of App Runner, Amplify, and RDS.

## Recommended AWS Architecture

- `frontend/` -> Next.js container
- `backend/` -> FastAPI container
- `nginx` -> reverse proxy on port `80`
- SQLite -> persisted through a Docker volume

Relevant files:

- `docker-compose.ec2.yml`
- `deploy/ec2/nginx.conf`
- `.env.ec2.example`

## Why this is cheaper

- One EC2 instance is usually the lowest-friction AWS option for a credit-based account.
- SQLite removes managed database cost entirely.
- Nginx lets the frontend and backend share one public endpoint.
- The frontend is built with `NEXT_PUBLIC_API_URL=/api`, so the browser talks to the backend through the same host.

## 1. Launch the EC2 instance

Use an EC2 instance type that is currently free-tier eligible for your account and region.

AWS documents that current free-tier eligibility depends on account creation date, and newer accounts use a credit-based model with eligible instance types such as `t3.micro` and `t4g.micro`, while older accounts may use `t2.micro` or `t3.micro`.

Recommended practical choice:

- Amazon Linux 2023
- `t3.micro` if available and free-tier eligible in your account

Important AWS note:

- AWS documents that `t3.micro` can default to Unlimited mode, which can incur extra charges if sustained CPU usage is high.

## 2. Configure the EC2 security group

Allow inbound:

- `22` for SSH
- `80` for HTTP

Optional later:

- `443` for HTTPS if you add TLS

## 3. Connect to the EC2 instance

SSH into the machine:

```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

## 4. Install Docker and Docker Compose

On Amazon Linux 2023, install Docker and start it:

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user
```

Log out and SSH back in so the Docker group change applies.

Install the Docker Compose plugin if needed:

```bash
docker compose version
```

If the command is missing, install the Compose plugin using your OS package manager or Docker’s current plugin instructions for Amazon Linux.

## 5. Clone the repository

```bash
git clone https://github.com/rohitrajbuilds/ProcureOS.git
cd ProcureOS
```

## 6. Create the EC2 environment file

Copy the example file:

```bash
cp .env.ec2.example .env.ec2
```

Edit `.env.ec2` and set:

- `APP_ORIGIN=http://YOUR_EC2_PUBLIC_IP`
- `SECRET_KEY=<a-long-random-secret>`

If you later attach a domain, replace the IP with:

- `http://your-domain.com`

## 7. Start the application

Run:

```bash
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up -d --build
```

This starts:

- backend
- frontend
- nginx

## 8. Verify the deployment

Check:

- App root:
  `http://YOUR_EC2_PUBLIC_IP`
- Backend health:
  `http://YOUR_EC2_PUBLIC_IP/health`

Then test:

1. Register
2. Log in
3. Open Vendors
4. Create a procurement request
5. Open the decision page

## 9. Updating the app later

From the EC2 instance:

```bash
git pull
docker compose --env-file .env.ec2 -f docker-compose.ec2.yml up -d --build
```

## 10. Optional next step for production polish

Once the app is working, the next good upgrade is:

- attach an Elastic IP or domain
- add HTTPS with Nginx and Let’s Encrypt

## AWS references used

These current AWS docs support this deployment direction:

- EC2 free-tier eligibility and credit model:
  https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-free-tier-usage.html
- Launching EC2 instances:
  https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/LaunchingAndUsingInstances.html
- App Runner source-directory behavior:
  https://docs.aws.amazon.com/apprunner/latest/dg/service-source-code.html
- Amplify monorepo config:
  https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html
