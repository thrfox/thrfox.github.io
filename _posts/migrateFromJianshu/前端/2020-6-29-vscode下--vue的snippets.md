---
layout: post
title: vscode下--vue的snippets.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 前端
---

### 复制到vscode的snipper里，缩写vv

```JSON
{
  "Create vue template": {
    "prefix": "vv",
    "body": [
      "<template>",
      "  <div>",
      "    ${4:content}",
      "  </div>",
      "</template>",
      "<script>",
      "export default {",
      "  name: \"${2:component_name}\",",
      "  components: {},",
      "  data () {",
      "    return {",
      "    };",
      "  },",
      "  computed: {},",
      "  watch: {},",
      "  created() {},",
      "  mounted() {},",
      "  beforeDestroy() {},",
      "  methods: {},",
      "}",
      "</script>",
      "<style lang=\"${3:less}\" scoped>",
      "</style>",
      ""
    ],
    "description": "Create vue template"
  }
}

```
