#---- Base python ----
FROM python:3.12-slim-bullseye as base

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /src

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# Install Python dependencies
COPY server/requirements.txt /src/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY server/ /src/

# Collect static files
RUN python manage.py collectstatic --noinput

# Command to run the application
CMD ["daphne", "-p", "8000", "-b", "0.0.0.0", "server.asgi:application"]
