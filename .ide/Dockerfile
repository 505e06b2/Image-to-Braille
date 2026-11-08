#帮助文档地址: https://docs.cnb.cool/zh/vscode/quick-start.html
FROM cnbcool/default-dev-env:latest

# 腾讯云软件源使用示例: https://cnb.cool/examples/mirrors/mirrors.cloud.tencent.com

# 以及按需安装其他软件
RUN apt-get update && apt-get install -y git sudo vim curl git-lfs

# 安装 code-server 和 vscode 常用插件
RUN curl -fsSL https://code-server.dev/install.sh | sh -s -- --version 4.100.3 \
  && code-server --install-extension cnbcool.cnb-welcome \
  && code-server --install-extension redhat.vscode-yaml \
  && code-server --install-extension detachhead.basedpyright \
  && code-server --install-extension tamasfe.even-better-toml \
  && code-server --install-extension ygqygq2.turbo-file-header \
  && code-server --install-extension tencent-cloud.coding-copilot \
  && code-server --install-extension eamodio.gitlens \
  && code-server --install-extension cloudstudio.live-server \
  && code-server --install-extension mhutchie.git-graph \
  && code-server --install-extension waderyan.gitblame \
  && code-server --install-extension donjayamanne.githistory \
  && code-server --install-extension yandeu.five-server \
  && code-server --install-extension ms-ceintl.vscode-language-pack-zh-hans \
  && wget https://cnb.cool/SDCOM/moren/html/-/git/raw/main/.ide/argv.json -O /root/.local/share/code-server/User/argv.json \
  && wget https://cnb.cool/SDCOM/moren/html/-/git/raw/main/.ide/languagepacks.json -O /root/.local/share/code-server/languagepacks.json \
  && echo done

# 安装 ssh 服务，用于支持 VSCode 客户端通过 Remote-SSH 访问开发环境
RUN apt-get update && apt-get install -y wget unzip openssh-server

# 安装 docker-compose
RUN curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose \
  && chmod +x /usr/local/bin/docker-compose \
  && docker-compose --version \
  && echo done

# 安装 fastfetch
RUN wget https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb \
  && dpkg -i fastfetch-linux-amd64.deb \
  && rm fastfetch-linux-amd64.deb \
  && echo done

# 指定工作目录
WORKDIR /workspace

# 指定容器启动时默认执行的命令
CMD ["code-server", "--bind-addr", "0.0.0.0:8080", "--auth", "none"]

# 指定字符集支持命令行输入中文（根据需要选择字符集）
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8