---
layout: post
title: 【JavaScript】关于DOM未载入完成随即向DOM绑定方法的错误.md
subtitle: 简书迁移
author: "thrfox"
header-style: text
tags:
  - 随笔
---

### 描述
grid在reload的时候会重新载入DOM,若DOM在未载入完成随即向DOM绑定autocomplete方法可能会造成不可知的错误
```Javascript
function loadGrid() {
            grid.parameters = new Object();
            grid.load();

            for (var i = 0; i < gridDatas.length; i++) {
                var seq = gridDatas[i].stockout_detail_sequence;
                initGoodsAuto(i, seq);
            }
        }
function initGoodsAuto(colNo, id) {
                $('#goods_name_' + id).autocomplete({
                    serviceUrl: '${htz.cxp }/core/common/goods/auto_complete/data',
                    ....
                });
            }
```
