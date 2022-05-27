package com.jflyfox.util.cache.impl;

import com.jfinal.plugin.activerecord.Model;
import com.jflyfox.util.annotation.ClassSearcher;
import com.jflyfox.util.serializable.Serializer;
import junit.framework.TestCase;
import org.apache.commons.io.input.ObservableInputStream;
import org.easymock.EasyMock;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.easymock.EasyMock.expect;

@RunWith(value = Parameterized.class)
public class MemorySerializeCacheTest extends TestCase {
    private  MemorySerializeCache memorySerializeCache;
    private String key;
    private Object value;
    private String name;
    private Serializer serializer;
    private Map<String, byte[]> map;
    @Before
    public void setUp() throws Exception{
        memorySerializeCache = new MemorySerializeCache();
        serializer = EasyMock.createMock(Serializer.class);
        map = new ConcurrentHashMap<String, byte[]>();
    }
    @After
    public void tearDown() throws Exception{

    }

    public MemorySerializeCacheTest(String key, Object value, String name){
        this.key = key;
        this.value = value;
        this.name = name;
    }

    @Parameterized.Parameters(name = "{index}: username = {0} , password = {1}, expect1 = {2}, expect2 = {3} ")
    public static  Iterable<Object[]> area() {
        return Arrays.asList(new Object[][] {
                {"string","value", ""},
                {"int", 1, null},
                {"float", 2.2, "name"},
                {"空", "", "汉字"},
                {"null", null, ",/@+-*/?，|、·”“\"\"[]"}
        });
    }

    @Test
    public void testName(){
        assertEquals(memorySerializeCache, memorySerializeCache.name(name));
    }

    @Test
    public void testAdd(){
        assertEquals(memorySerializeCache, memorySerializeCache.add(key, value));
    }

    @Test
    public void testGet() throws IOException {
        assertEquals(serializer.deserialize(map.get(key)), memorySerializeCache.get(key));
    }

}
