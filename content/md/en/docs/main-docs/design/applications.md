---
title: Designing runtime applications
description:
keywords:
---

This diagram depicts how metadata is generated, at build time and then accessible at run time.

                          ┌─────────────────┐   
                          │state_getMetadata| 
                          │    RPC method   │
                          └─────────────────┘ 
                                 │   ▲
                                 ▼   │             Run time
                            ┌─────────────┐   
                            │Type registry|  
                            └─────────────┘   
                              scale-info 
                                   ▲
                                   │                Compile time       
                             frame-metadata
                                   ▲
                                   │
                            ┌──────┴────────┐
                            │    Runtime    │
                            │  (n pallets)  │
                            └───────────────┘
                      
                 (Use bullet points as part above diagram)



