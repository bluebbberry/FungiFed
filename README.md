# FediFungi - Host

Starter pack for growing your own fungi on the fediverse!

## The idea behind FediFungi: Benevolent, Decentralized, Evolving Bots on the Fediverse

FediFungi is an experimental framework for creating and managing distributed bots, called "Fungi," that operate and evolve on the Fediverse. Inspired by the principles of federated learning, open-source development, and decentralized social networks, FediFungi introduces a novel way of deploying systems that adapt, migrate, and grow based on community interaction and feedback.

### Table of Contents
- [Introduction](#introduction)
- [Key Features](#key-features)
- [Running Your Own Fungi Host](#running-your-own-fungi-host)
- [Getting Started](#getting-started)
- [Requirements](#requirements)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

### Introduction

FediFungi explores the potential of decentralized bots that:
1. Grow and evolve by listening to feedback and commands from users on the Fediverse.
2. Share and modify code dynamically across hashtags, creating an ecosystem of collaborative development.
3. Migrate between hosts and improve their "health" by adopting the best feedback and code contributions.

The project aims to demonstrate how federated, community-driven bots could thrive in a decentralized environment while remaining transparent and open to scrutiny.

### Key Features

- **Decentralized Bots**: Fungi operate independently, listening to and posting on Fediverse hashtags.
- **Dynamic Code Evolution**: Bots adapt their behavior by ingesting and executing new code shared in their network.
- **Feedback-Driven Improvement**: Fungi respond to feedback from users to refine their algorithms and behavior.
- **Migration Mechanism**: Bots can detach from a "host" and migrate to new environments based on their code health.
- **Transparency**: All Fungi code is openly available and auditable, promoting trust and collaboration.

### Running Your Own Fungi Host

Setting up a Fungi host allows you to contribute to the FediFungi ecosystem by hosting one or more Fungi bots. Here’s how to get started:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/fedifungi.git
   cd fedifungi
   ```

2. **Install Dependencies**:
 
From now on, in the `/app`-folder, run:
   ```bash
   npm install
   ```

3. **Configure Your Host**:
    - Create a `.env` file to define your environment variables.
    - Example configuration:
      ```env
      MASTODON_API_KEY=your-api-key
      ACCOUNT_NAME=your-account-name
      URL=url-to-my-instance
      MYCELIAL_HASHTAG=hashtag that fungi communicate over
      ```

4. **Start the Fungi Host**:
   ```bash
   node index.js
   ```

Your fungi-bot should be up and running. Congratulations!

### Running a Fungi-Bot

1. **After Deployment**:
    - Once the host is running, the bot will attach itself to the configured seed hashtag and begin its lifecycle.
    - It will post code snippets and listen for feedback or additional code contributions.

2. **Engage with the Community**:
    - Users can interact with your Fungi bot by replying to its posts with suggestions or commands.

3. **Evaluate and Iterate**:
    - Monitor the bot’s performance and adapt your host’s configuration as needed.

### Requirements

- Node.js v16+
- NPM or Yarn
- Access to a Fediverse-compatible API (e.g., Mastodon, Pleroma)

### Architecture

- **Core Lifecycle**:
    - Periodically fetch posts from the current hashtag.
    - Execute commands or user-provided code.
    - Post feedback and migrate as needed.

- **Code Execution**:
    - Code snippets are sandboxed for safety.

- **Feedback Loop**:
    - Bots post their results and health status to a feedback hashtag.
    - Health is evaluated based on user engagement and predefined metrics.

### Contributing

We welcome contributions to FediFungi! Here’s how you can help:

1. Fork the repository and create a feature branch.
2. Write clear, well-documented code.
3. Submit a pull request with a detailed explanation of your changes.

For major changes, please open an issue first to discuss your ideas.

### License

FediFungi is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
