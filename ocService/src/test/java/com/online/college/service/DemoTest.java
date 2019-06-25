package com.online.college.service;

import io.qameta.allure.Feature;
import io.qameta.allure.Stories;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * ClassName :DemoTest
 * Description:
 * Author: 陈胜楠
 * Date: 2019/6/25 3:42 PM
 * Version 1.0
 */
public class DemoTest {
    @Feature("测试")
    @Stories(value = {@Story(value = "基础测试")})
        @Test(groups = "测试1")
        public void testReturnString(){
            Assert.assertEquals("test","test");
        }
    @Feature("测试")
    @Stories(value = {@Story(value = "性能测试")})
    @Test(groups = "测试2")
        public void testReString(){
            Assert.assertEquals("test","test");
        }


}
